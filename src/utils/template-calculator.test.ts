import test from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeSceneTimestamps,
  generateBeatMarkers,
  validateTemplateSchema,
  formatTime,
} from './template-calculator';
import { CapCutScene, CapCutTemplateStrategy } from '../types/template';

test('normalizeSceneTimestamps calculates continuous start and end offsets summing to targetLength', () => {
  const dummyScenes: CapCutScene[] = [
    {
      scene_number: 1,
      duration_seconds: 1,
      start_time: 0,
      end_time: 0,
      shot_type: 'Hook',
      visual_action: 'Action',
      transition_type: 'Cut',
      text_overlay: 'Text',
      text_animation_style: 'Pop',
      audio_cue: 'Hit',
      capcut_preset_tip: 'Tip',
      media_is_editable: true,
      text_is_editable: true,
    },
    {
      scene_number: 2,
      duration_seconds: 2,
      start_time: 0,
      end_time: 0,
      shot_type: 'Action',
      visual_action: 'Action 2',
      transition_type: 'Zoom',
      text_overlay: 'Text 2',
      text_animation_style: 'Slide',
      audio_cue: 'Drop',
      capcut_preset_tip: 'Tip 2',
      media_is_editable: true,
      text_is_editable: false,
    },
  ];

  const targetLength = 15;
  const normalized = normalizeSceneTimestamps(dummyScenes, targetLength);

  assert.equal(normalized.length, 2);
  assert.equal(normalized[0].start_time, 0);
  assert.equal(normalized[0].end_time, normalized[1].start_time);
  assert.equal(normalized[1].end_time, targetLength);
  assert.equal(normalized[0].media_is_editable, true);
  assert.equal(normalized[1].text_is_editable, false);
});

test('normalizeSceneTimestamps handles many short scenes without overshooting targetLength', () => {
  const shortScenes: CapCutScene[] = Array.from({ length: 30 }, (_, i) => ({
    scene_number: i + 1,
    duration_seconds: 0.1,
    start_time: 0,
    end_time: 0,
    shot_type: `Cut ${i + 1}`,
    visual_action: 'Action',
    transition_type: 'Cut',
    text_overlay: 'Text',
    text_animation_style: 'Pop',
    audio_cue: 'Beat',
    capcut_preset_tip: 'None',
    media_is_editable: true,
    text_is_editable: true,
  }));

  const targetLength = 3;
  const normalized = normalizeSceneTimestamps(shortScenes, targetLength);

  assert.equal(normalized.length, 30);
  assert.equal(normalized[0].start_time, 0);
  assert.equal(normalized[29].end_time, 3);
  // Verify strictly contiguous and non-negative
  for (let i = 0; i < normalized.length; i++) {
    assert.ok(normalized[i].duration_seconds > 0);
    if (i > 0) {
      assert.equal(normalized[i].start_time, normalized[i - 1].end_time);
    }
  }
});

test('generateBeatMarkers parses BPM ranges and generates beat timestamps', () => {
  const markers = generateBeatMarkers('120 BPM', 2);
  assert.equal(markers.length, 5);
  assert.equal(markers[0], 0);
  assert.equal(markers[1], 0.5);
  assert.equal(markers[2], 1.0);
});

test('validateTemplateSchema returns true for complete and valid schema', () => {
  const validMock: CapCutTemplateStrategy = {
    niche: 'Fitness',
    target_length_seconds: 15,
    template_name: 'Workout Beat Drop',
    trend_summary: 'Fast sync cuts',
    trending_audio_category: 'Phonk Gym Motivation',
    recommended_audio_tracks: ['Track A'],
    pacing: {
      tempo: 'Fast',
      bpm_range: '130 BPM',
      cut_frequency: '0.5s',
      description: 'Rapid cuts',
    },
    scene_count: 2,
    scenes: [
      {
        scene_number: 1,
        duration_seconds: 1,
        start_time: 0,
        end_time: 1,
        shot_type: 'Close-up',
        visual_action: 'Lifting weights',
        transition_type: 'Flash White',
        text_overlay: 'Day 1 vs Day 90',
        text_animation_style: 'Bounce',
        audio_cue: 'Kick',
        capcut_preset_tip: 'Auto Velocity',
        media_is_editable: true,
        text_is_editable: true,
      },
      {
        scene_number: 2,
        duration_seconds: 14,
        start_time: 1,
        end_time: 15,
        shot_type: 'Wide',
        visual_action: 'Physique reveal',
        transition_type: 'Zoom Out',
        text_overlay: 'Never give up',
        text_animation_style: 'Fade In',
        audio_cue: 'Swell',
        capcut_preset_tip: 'HDR Effect',
        media_is_editable: true,
        text_is_editable: false,
      },
    ],
    transition_types: ['Flash White', 'Zoom Out'],
    text_animation_style: {
      style_name: 'Bold High Contrast',
      font_recommendation: 'Montserrat Black',
      animation_preset: 'Spring Bounce In',
      color_and_effects: 'White with neon cyan glow',
      placement_tip: 'Center frame',
    },
    viral_hook_tactics: ['Visual contrast in first 1.2s'],
    capcut_effect_recommendations: ['Edge Glow', 'Camera Shake'],
  };

  const validation = validateTemplateSchema(validMock);
  assert.equal(validation.isValid, true);
  assert.equal(validation.errors.length, 0);
});

test('validateTemplateSchema rejects missing or non-boolean editability flags without inventing them', () => {
  const invalidMock: any = {
    niche: 'Fitness',
    target_length_seconds: 5,
    template_name: 'Test',
    trend_summary: 'Summary',
    trending_audio_category: 'Audio',
    recommended_audio_tracks: ['A'],
    pacing: { tempo: 'Fast', bpm_range: '120', cut_frequency: '1s', description: 'Desc' },
    scene_count: 1,
    scenes: [
      {
        scene_number: 1,
        duration_seconds: 5,
        start_time: 0,
        end_time: 5,
        shot_type: 'Shot',
        visual_action: 'Action',
        transition_type: 'None',
        text_overlay: 'Text',
        text_animation_style: 'Style',
        audio_cue: 'Cue',
        capcut_preset_tip: 'Tip',
        // media_is_editable and text_is_editable intentionally missing
      },
    ],
    transition_types: ['None'],
    text_animation_style: { style_name: 'S', font_recommendation: 'F', animation_preset: 'P', color_and_effects: 'C', placement_tip: 'T' },
    viral_hook_tactics: ['Tactic'],
    capcut_effect_recommendations: ['Effect'],
  };

  const validation = validateTemplateSchema(invalidMock);
  assert.equal(validation.isValid, false);
  assert.ok(validation.errors.some((e) => e.includes('media_is_editable')));
  assert.ok(validation.errors.some((e) => e.includes('text_is_editable')));
});

test('validateTemplateSchema rejects non-contiguous timelines and duration mismatches', () => {
  const nonContiguous: any = {
    niche: 'Travel',
    target_length_seconds: 10,
    pacing: { tempo: 'T', bpm_range: '120', cut_frequency: '1', description: 'D' },
    trending_audio_category: 'Lofi',
    transition_types: ['Cut'],
    text_animation_style: { style_name: 'S', font_recommendation: 'F', animation_preset: 'P', color_and_effects: 'C', placement_tip: 'T' },
    scene_count: 2,
    scenes: [
      {
        scene_number: 1,
        start_time: 0,
        end_time: 3,
        duration_seconds: 3,
        shot_type: 'A',
        visual_action: 'B',
        transition_type: 'C',
        text_overlay: 'D',
        text_animation_style: 'E',
        audio_cue: 'F',
        capcut_preset_tip: 'G',
        media_is_editable: true,
        text_is_editable: true,
      },
      {
        scene_number: 2,
        start_time: 4, // Gap between 3 and 4!
        end_time: 8,  // Ends at 8, but target_length_seconds is 10!
        duration_seconds: 4,
        shot_type: 'A',
        visual_action: 'B',
        transition_type: 'C',
        text_overlay: 'D',
        text_animation_style: 'E',
        audio_cue: 'F',
        capcut_preset_tip: 'G',
        media_is_editable: true,
        text_is_editable: false,
      },
    ],
  };

  const validation = validateTemplateSchema(nonContiguous);
  assert.equal(validation.isValid, false);
  assert.ok(validation.errors.some((e) => e.includes('non-contiguous')));
  assert.ok(validation.errors.some((e) => e.includes('Total duration mismatch')));
});

test('formatTime converts seconds to readable MM:SS.S', () => {
  assert.equal(formatTime(0), '00:00.0');
  assert.equal(formatTime(65.4), '01:05.4');
  assert.equal(formatTime(15), '00:15.0');
});
