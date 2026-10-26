"""Build a basic editable CapCut draft; creator publication remains manual."""
import argparse
import json
import math
import re
import shutil
import uuid
from pathlib import Path


def validate(spec):
    scenes = spec.get('scenes')
    total = spec.get('target_length_seconds')
    def number(x):
        return type(x) in (int, float) and math.isfinite(x)
    if not number(total) or not 3 <= total <= 60:
        raise ValueError('Duration must be 3–60 seconds')
    if not isinstance(scenes, list) or not scenes or len(scenes) > 120 or spec.get('scene_count') != len(scenes):
        raise ValueError('Invalid scene count')
    end = 0
    for i, scene in enumerate(scenes, 1):
        if not isinstance(scene, dict):
            raise ValueError('Invalid scene')
        start, stop, duration = (scene.get(k) for k in ('start_time', 'end_time', 'duration_seconds'))
        if not all(number(v) for v in (start, stop, duration)) or duration <= 0 or abs(start-end) > .001 or abs(stop-start-duration) > .001 or scene.get('scene_number') != i:
            raise ValueError(f'Scene {i}: invalid timing')
        if any(type(scene.get(k)) is not bool for k in ('media_is_editable', 'text_is_editable')):
            raise ValueError(f'Scene {i}: missing editability flags')
        if not isinstance(scene.get('text_overlay'), str):
            raise ValueError(f'Scene {i}: text must be a string')
        end = stop
    if abs(end-total) > .001:
        raise ValueError('Total duration mismatch')
    return scenes


def build(spec_path, assets_path, drafts_dir):
    import pycapcut as draft
    spec_path, assets_path, drafts_dir = map(Path, (spec_path, assets_path, drafts_dir))
    spec = json.loads(spec_path.read_text(encoding='utf-8'))
    scenes = validate(spec)
    mapping = json.loads(assets_path.read_text(encoding='utf-8'))
    materials = []
    for scene in scenes:
        key = str(scene['scene_number'])
        value = mapping.get(key)
        if not isinstance(value, str) or not value:
            raise ValueError(f'Missing local media path for scene {key}')
        source = Path(value).expanduser()
        if not source.is_absolute(): source = assets_path.parent / source
        source = source.resolve(strict=True)
        material = draft.VideoMaterial(str(source))
        if material.material_type == 'video' and material.duration < round(scene['duration_seconds'] * 1_000_000):
            raise ValueError(f'Scene {key}: source video is too short; no silent looping or stretching')
        materials.append(source)
    ratio = spec.get('aspect_ratio', '9:16')
    dimensions = {'9:16': (1080,1920), '16:9': (1920,1080), '1:1': (1080,1080)}
    if ratio not in dimensions: raise ValueError('Unsupported aspect ratio')
    name = re.sub(r'[^a-zA-Z0-9_-]+', '-', spec.get('template_name', 'Template')).strip('-')[:60] or 'Template'
    name += '-' + uuid.uuid4().hex[:8]
    drafts_dir.mkdir(parents=True, exist_ok=True)
    script = draft.DraftFolder(str(drafts_dir)).create_draft(name, *dimensions[ratio], fps=30)
    folder = drafts_dir / name
    try:
        media_dir = folder / 'media'; media_dir.mkdir()
        script.add_track(draft.TrackType.video, 'media')
        script.add_track(draft.TrackType.text, 'text')
        notes = []
        for scene, source in zip(scenes, materials):
            i = scene['scene_number']
            destination = media_dir / f'{i:03d}{source.suffix.lower()}'
            shutil.copy2(source, destination)
            timerange = draft.Timerange(round(scene['start_time']*1_000_000), round(scene['duration_seconds']*1_000_000))
            script.add_segment(draft.VideoSegment(str(destination.resolve()), timerange, volume=0), 'media')
            if scene['text_overlay']:
                script.add_segment(draft.TextSegment(scene['text_overlay'], timerange, style=draft.TextStyle(size=7, bold=True, align=1, auto_wrapping=True), clip_settings=draft.ClipSettings(transform_y=-.45)), 'text')
            notes.append({'scene': i, 'media_is_editable': scene['media_is_editable'], 'text_is_editable': scene['text_is_editable'], 'manual_effects': {k:scene.get(k,'') for k in ('transition_type','text_animation_style','capcut_preset_tip','audio_cue')}})
        script.save()
        (folder/'template-spec.json').write_text(json.dumps(spec,indent=2),encoding='utf-8')
        (folder/'CREATOR_REVIEW.json').write_text(json.dumps({'status':'DRAFT_ONLY_NOT_PUBLISHED', 'notes':['Basic cuts and styled text only. Effects and music are not applied.', 'Editability flags are intent metadata, not CapCut creator-slot locks. Configure replaceable slots in your creator workflow.', 'Choose licensed audio inside CapCut. Verify each crop, line wrap and timing.', 'Build on the Windows machine running CapCut; absolute media paths must remain valid.'], 'scenes':notes},indent=2),encoding='utf-8')
        return folder
    except Exception:
        shutil.rmtree(folder)  # Only this newly created unique output; never an existing draft.
        raise

if __name__ == '__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('spec'); parser.add_argument('assets'); parser.add_argument('--drafts-dir',required=True)
    args=parser.parse_args()
    print(build(args.spec,args.assets,args.drafts_dir))
