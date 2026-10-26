import { CapCutScene, CapCutTemplateStrategy } from '../types/template';

/**
 * Normalizes scene durations and calculates accurate start_time and end_time offsets.
 * Automatically aligns scene durations to total the exact targetLength without overshooting,
 * even with many short scenes.
 */
export function normalizeSceneTimestamps(
  scenes: CapCutScene[],
  targetLength: number
): CapCutScene[] {
  if (!scenes || scenes.length === 0) return [];
  const n = scenes.length;
  const total = Number.isFinite(targetLength) && targetLength > 0 ? targetLength : 15;

  const rawDurations = scenes.map((s) => {
    const val = Number(s.duration_seconds);
    return Number.isFinite(val) && val > 0 ? val : 1;
  });
  const rawSum = rawDurations.reduce((a, b) => a + b, 0);

  // Proportional scaling so sum matches total
  const durations = rawDurations.map((d) => (d / rawSum) * total);

  // Prevent sub-millisecond collapse or negative numbers:
  // If targetLength allows at least 0.01s per scene, clamp to minimum duration
  const minDur = total / (n * 10);
  for (let i = 0; i < n; i++) {
    if (durations[i] < minDur) {
      durations[i] = minDur;
    }
  }
  const scaledSum = durations.reduce((a, b) => a + b, 0);
  for (let i = 0; i < n; i++) {
    durations[i] = (durations[i] / scaledSum) * total;
  }

  let currentOffset = 0;
  return scenes.map((scene, index) => {
    const isLast = index === n - 1;
    const start_time = Number(currentOffset.toFixed(3));
    let end_time: number;
    let duration: number;

    if (isLast) {
      end_time = Number(total.toFixed(3));
      duration = Number((end_time - start_time).toFixed(3));
      if (duration <= 0) {
        duration = 0.001;
        end_time = Number((start_time + duration).toFixed(3));
      }
    } else {
      duration = Number(durations[index].toFixed(3));
      if (duration <= 0) duration = 0.001;
      end_time = Number((start_time + duration).toFixed(3));
      currentOffset = end_time;
    }

    return {
      ...scene,
      scene_number: index + 1,
      duration_seconds: duration,
      start_time,
      end_time,
      media_is_editable: scene.media_is_editable,
      text_is_editable: scene.text_is_editable,
    };
  });
}

/**
 * Extracts average BPM from a string like "120-130 BPM" or "128 BPM" and generates beat markers.
 */
export function generateBeatMarkers(bpmStr: string, totalSeconds: number): number[] {
  let bpm = 120; // default
  if (bpmStr) {
    const matches = bpmStr.match(/\d+/g);
    if (matches && matches.length > 0) {
      const numbers = matches.map(Number);
      if (numbers.length >= 2) {
        bpm = (numbers[0] + numbers[1]) / 2;
      } else {
        bpm = numbers[0];
      }
    }
  }

  // Cap BPM to sane range (60 - 240)
  bpm = Math.min(240, Math.max(60, bpm));

  const secondsPerBeat = 60 / bpm;
  const markers: number[] = [];
  let t = 0;

  while (t <= totalSeconds) {
    markers.push(Number(t.toFixed(3)));
    t += secondsPerBeat;
  }

  return markers;
}

/**
 * Validates that a strategy matches the required CapCut template schema.
 * Rejects non-contiguous timelines, duration mismatches, and does not invent missing editability flags.
 */
export function validateTemplateSchema(
  strategy: Partial<CapCutTemplateStrategy>
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!strategy.niche || typeof strategy.niche !== 'string') {
    errors.push('Missing or invalid "niche"');
  }
  const total = strategy.target_length_seconds;
  if (typeof total !== 'number' || !Number.isFinite(total) || total < 3 || total > 60) {
    errors.push('Duration must be between 3 and 60 seconds');
  }
  if (!strategy.pacing || typeof strategy.pacing !== 'object') {
    errors.push('Missing or invalid "pacing" object');
  }
  if (!strategy.trending_audio_category || typeof strategy.trending_audio_category !== 'string') {
    errors.push('Missing or invalid "trending_audio_category"');
  }
  if (!Array.isArray(strategy.transition_types) || strategy.transition_types.length === 0) {
    errors.push('Missing or empty "transition_types" array');
  }
  if (!strategy.text_animation_style || typeof strategy.text_animation_style !== 'object') {
    errors.push('Missing or invalid "text_animation_style" object');
  }

  const scenes = strategy.scenes;
  if (!Array.isArray(scenes) || scenes.length === 0) {
    errors.push('Missing or empty "scenes" array');
  } else {
    if (strategy.scene_count !== scenes.length) {
      errors.push(`Scene count (${strategy.scene_count}) does not match scenes array length (${scenes.length})`);
    }

    let previousEnd = 0;
    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      const num = i + 1;
      if (scene.scene_number !== num) {
        errors.push(`Scene ${num}: scene_number must be ${num}`);
      }
      if (
        typeof scene.start_time !== 'number' ||
        !Number.isFinite(scene.start_time) ||
        typeof scene.end_time !== 'number' ||
        !Number.isFinite(scene.end_time) ||
        typeof scene.duration_seconds !== 'number' ||
        !Number.isFinite(scene.duration_seconds)
      ) {
        errors.push(`Scene ${num}: timing values must be finite numbers`);
      } else {
        if (scene.duration_seconds <= 0) {
          errors.push(`Scene ${num}: duration must be positive`);
        }
        if (Math.abs(scene.start_time - previousEnd) > 0.01) {
          errors.push(`Scene ${num}: non-contiguous timeline (expected start ${previousEnd}, got ${scene.start_time})`);
        }
        if (Math.abs(scene.end_time - scene.start_time - scene.duration_seconds) > 0.01) {
          errors.push(`Scene ${num}: end_time does not equal start_time + duration_seconds`);
        }
        previousEnd = scene.end_time;
      }

      if (typeof scene.media_is_editable !== 'boolean') {
        errors.push(`Scene ${num}: media_is_editable must be a boolean`);
      }
      if (typeof scene.text_is_editable !== 'boolean') {
        errors.push(`Scene ${num}: text_is_editable must be a boolean`);
      }
      if (typeof scene.text_overlay !== 'string') {
        errors.push(`Scene ${num}: text_overlay must be a string`);
      }
    }

    if (typeof total === 'number' && Math.abs(previousEnd - total) > 0.01) {
      errors.push(`Total duration mismatch: scenes sum to ${previousEnd}s, expected ${total}s`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Formats seconds into MM:SS.ms string. E.g. 4.5 -> "00:04.5"
 */
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const minsStr = mins.toString().padStart(2, '0');
  const secsStr = secs.toFixed(1).padStart(4, '0');
  return `${minsStr}:${secsStr}`;
}
