import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { CapCutTemplateStrategy, GenerateStrategyRequest } from './src/types/template';
import { normalizeSceneTimestamps } from './src/utils/template-calculator';
import { PRESET_TEMPLATES } from './src/data/presetTemplates';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Google GenAI client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// Fallback generator when API key is missing
function generateFallbackStrategy(niche: string, targetLength: number, style?: string): CapCutTemplateStrategy {
  // Try finding close preset
  const matchingPreset = PRESET_TEMPLATES.find(
    (p) =>
      p.niche.toLowerCase().includes(niche.toLowerCase()) ||
      niche.toLowerCase().includes(p.niche.toLowerCase().split(' ')[0])
  );

  if (matchingPreset) {
    const scaledScenes = normalizeSceneTimestamps(matchingPreset.scenes, targetLength);
    return {
      ...matchingPreset,
      niche,
      target_length_seconds: targetLength,
      scene_count: scaledScenes.length,
      scenes: scaledScenes,
      aspect_ratio: '9:16',
      schema_version: '1.0',
      generation_mode: 'offline',
      generated_at: new Date().toISOString(),
    };
  }

  // Create adaptive structure based on length
  const sceneCount = Math.max(3, Math.min(12, Math.round(targetLength / 2.2)));
  const sceneDuration = targetLength / sceneCount;

  const scenes = Array.from({ length: sceneCount }, (_, i) => {
    const isFirst = i === 0;
    const isLast = i === sceneCount - 1;
    return {
      scene_number: i + 1,
      duration_seconds: Number(sceneDuration.toFixed(2)),
      start_time: Number((i * sceneDuration).toFixed(2)),
      end_time: Number(((i + 1) * sceneDuration).toFixed(2)),
      shot_type: isFirst
        ? 'Eye-Level Macro Hook Shot'
        : isLast
        ? 'Cinematic Pullback & Loop Trigger'
        : 'Dynamic Tracking / Action Angle',
      visual_action: isFirst
        ? `High-energy visual disruption introducing the ${niche} premise immediately in first 1.2s.`
        : isLast
        ? `Satisfying conclusion or outcome showcase with clear engagement call-to-action.`
        : `Progressive reveal step ${i} displaying key highlight of ${niche}.`,
      transition_type: isFirst
        ? 'Flash White + Sound Impact'
        : i % 2 === 0
        ? 'Zoom In Whip Cut'
        : 'Camera Pan Right with Motion Blur',
      text_overlay: isFirst
        ? `Wait until the end... 🤯 #${niche.replace(/\s+/g, '')}`
        : isLast
        ? 'Follow for more • Save this 📌'
        : `Key Detail 0${i} ⚡`,
      text_animation_style: 'Spring Bounce In + Neon Glow',
      audio_cue: isFirst ? 'Bass impact & riser' : 'Snare beat-sync hit',
      capcut_preset_tip: 'Apply CapCut "Smart Motion Blur" (Blur 50, Blend 35).',
      media_is_editable: true,
      text_is_editable: isLast ? false : true,
    };
  });

  return {
    niche,
    target_length_seconds: targetLength,
    template_name: `Viral ${niche} Velocity Flow`,
    trend_summary: `Creative suggestion for ${niche} structure leveraging high-tempo beat drops and bold kinetic text animations. Current popularity and rights are not verified.`,
    trending_audio_category: 'Fast Phonk / Hyper-Aesthetic Lo-fi Club / Sped-up Remix',
    recommended_audio_tracks: [
      `Trending ${niche} Audio Beat`,
      'Montagem Phonk (Slowed + Reverb)',
      'Aesthetic Synthwave Club Mix',
    ],
    pacing: {
      tempo: 'High-Paced Beat-Drop Pacing',
      bpm_range: '128 - 138 BPM',
      cut_frequency: `Every ${(sceneDuration).toFixed(1)}s on average, accelerating on chorus drop`,
      description: `Fast-paced rhythm synchronized to percussion beats with a 1.2s opening hook.`,
    },
    scene_count: sceneCount,
    scenes: normalizeSceneTimestamps(scenes, targetLength),
    transition_types: [
      'Flash White + Sound Impact',
      'Zoom In Whip Cut',
      'Camera Pan Right with Motion Blur',
      'Glitch Split Screen',
      'Seamless Loop Match Cut',
    ],
    text_animation_style: {
      style_name: 'Kinetic High-Contrast Bold',
      font_recommendation: 'The Bold Font / Montserrat Black',
      animation_preset: 'Spring Bounce In + Motion Blur',
      color_and_effects: 'Pure White with 30% Black Shadow & Vibrant Neon Outline',
      placement_tip: 'Position within central safe zone away from TikTok caption margins.',
    },
    viral_hook_tactics: [
      'Visual contrast change in first 0.8s resets viewer attention threshold',
      'Beat-synced transitions sustain watch velocity through mid-video drop-off point',
      'Loop-designed final frame encourages multiple view passes',
    ],
    capcut_effect_recommendations: [
      'Auto-Velocity with Optical Flow',
      'Camera Shake 2 on drop',
      'Edge Glow Neon (35% intensity)',
      'Subtle Film Grain 1998',
    ],
    aspect_ratio: '9:16',
    schema_version: '1.0',
    generation_mode: 'offline',
    generated_at: new Date().toISOString(),
  };
}

// API Route: Generate CapCut Template Strategy with Google Search Grounding
app.post('/api/generate-strategy', async (req: Request, res: Response) => {
  const { niche, targetLength, stylePreference }: GenerateStrategyRequest = req.body || {};
  const duration = Number(targetLength);

  // Validate inputs
  if (
    !niche ||
    typeof niche !== 'string' ||
    !niche.trim() ||
    !Number.isFinite(duration) ||
    duration < 3 ||
    duration > 60
  ) {
    res.status(400).json({
      error: 'Invalid request: "niche" must be a non-empty string and "targetLength" must be a number between 3 and 60 seconds.',
    });
    return;
  }

  // If Gemini client is not initialized, return clearly labelled offline suggestion
  if (!ai) {
    console.log('No GEMINI_API_KEY configured, returning offline creative suggestion');
    const fallback = generateFallbackStrategy(niche.trim(), duration, stylePreference);
    res.json(fallback);
    return;
  }

  try {
    const modelName = process.env.GEMINI_MODEL || 'gemini-3.8-flash';
    const prompt = `You are a CapCut template strategist. Given a niche and target length, use Google Search grounding to identify currently trending CapCut template structures (scene count, pacing, transition types, text animation style, trending audio category).

Niche: "${niche.trim()}"
Target Video Length: ${duration} seconds
${stylePreference ? `Preferred Style/Vibe: "${stylePreference}"` : ''}

Search current TikTok and CapCut trends, viral template formats, trending sound categories, and editing techniques for this exact niche.

Output ONLY the JSON object matching the provided schema — no commentary, no markdown code block backticks if possible (or strictly inside \`\`\`json \`\`\`).

The JSON schema must adhere strictly to this structure:
{
  "niche": "${niche.trim()}",
  "target_length_seconds": ${duration},
  "template_name": "string (Catchy viral CapCut template title)",
  "trend_summary": "string (Why this structure is currently viral on CapCut/TikTok)",
  "trending_audio_category": "string (Specific trending audio style or genre)",
  "recommended_audio_tracks": ["string", "string", "string"],
  "pacing": {
    "tempo": "string (e.g. Fast-Paced Beat-Drop, Smooth Cinematic, etc.)",
    "bpm_range": "string (e.g. 128 - 134 BPM)",
    "cut_frequency": "string (e.g. Every 0.4s on drop, 1.2s on hook)",
    "description": "string (How visual cuts align with the beat structure)"
  },
  "scene_count": number (reasonable count for a ${duration}s video, usually ${Math.max(3, Math.round(duration / 2.5))} to ${Math.max(4, Math.round(duration / 1.5))}),
  "scenes": [
    {
      "scene_number": 1,
      "duration_seconds": number (duration in seconds),
      "start_time": number,
      "end_time": number,
      "shot_type": "string (e.g. Close-up, POV, Wide pan, Drone, etc.)",
      "visual_action": "string (Concrete filming instruction for creator)",
      "transition_type": "string (Transition effect leading to next scene)",
      "text_overlay": "string (Exact hook/on-screen text)",
      "text_animation_style": "string (e.g. Spring Bounce In, Typewriter, etc.)",
      "audio_cue": "string (e.g. Bass drop, Snare hit, Riser peak)",
      "capcut_preset_tip": "string (Specific CapCut feature like Optical Flow, Velocity curve, 3D Zoom)",
      "media_is_editable": boolean (true if this shot is meant to be replaced by the template end-user's own footage),
      "text_is_editable": boolean (true if this text is a placeholder/example vs. true if it's a fixed caption that's part of the template's identity)
    }
  ],
  "transition_types": ["string", "string", "string"],
  "text_animation_style": {
    "style_name": "string",
    "font_recommendation": "string",
    "animation_preset": "string",
    "color_and_effects": "string",
    "placement_tip": "string"
  },
  "viral_hook_tactics": ["string", "string", "string"],
  "capcut_effect_recommendations": ["string", "string", "string"]
}`;

    const response = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.7,
      },
    });

    const responseText = response.text || '';

    // Extract grounding URLs if available
    const groundingSources: { title: string; uri: string }[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks && Array.isArray(chunks)) {
      for (const chunk of chunks) {
        if (chunk.web?.uri) {
          groundingSources.push({
            title: chunk.web.title || chunk.web.uri,
            uri: chunk.web.uri,
          });
        }
      }
    }

    // Parse JSON safely from response text
    let parsedData: CapCutTemplateStrategy;
    let cleanJson = responseText.trim();
    if (cleanJson.startsWith('```json')) {
      cleanJson = cleanJson.replace(/^```json\s*/i, '').replace(/\s*```$/, '');
    } else if (cleanJson.startsWith('```')) {
      cleanJson = cleanJson.replace(/^```\s*/, '').replace(/\s*```$/, '');
    }

    try {
      parsedData = JSON.parse(cleanJson);
    } catch {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Gemini response could not be parsed as JSON');
      }
    }

    // Ensure scenes have continuous normalized timestamps
    if (parsedData.scenes && Array.isArray(parsedData.scenes)) {
      parsedData.scenes = normalizeSceneTimestamps(parsedData.scenes, duration);
      parsedData.scene_count = parsedData.scenes.length;
    }

    parsedData.target_length_seconds = duration;
    parsedData.niche = niche.trim();
    parsedData.search_grounding_sources = groundingSources;
    parsedData.aspect_ratio = '9:16';
    parsedData.schema_version = '1.0';
    parsedData.generation_mode = 'grounded';
    parsedData.generated_at = new Date().toISOString();

    res.json(parsedData);
  } catch (error: any) {
    console.error('Error generating strategy via Gemini:', error);
    // Failed AI calls return an error rather than invented trends
    res.status(500).json({
      error: 'Live trend research failed: ' + (error?.message || 'Upstream error'),
    });
  }
});

// Preset templates route
app.get('/api/presets', (_req: Request, res: Response) => {
  res.json(PRESET_TEMPLATES);
});

// API Route: Multi-turn Chatbot with Context Awareness & Model Selection
app.post('/api/chat', async (req: Request, res: Response) => {
  const { messages, context, model } = req.body || {};

  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'Invalid request: "messages" must be a non-empty array.' });
    return;
  }

  // Model selection:
  // - gemini-4-argon for particularly complex tasks
  // - gemini-3.8-flash for general tasks (default)
  // - gemini-3.1-flash-lite for tasks that should happen fast
  let selectedModel = 'gemini-3.8-flash';
  if (model === 'gemini-4-argon') {
    selectedModel = 'gemini-4-argon';
  } else if (model === 'gemini-3.1-flash-lite') {
    selectedModel = 'gemini-3.1-flash-lite';
  }

  // Build context-aware system instruction
  let contextSnippet = '';
  if (context && context.templateName) {
    contextSnippet = `
ACTIVE CAPCUT TEMPLATE CONTEXT IN WORKSPACE:
- Template Name: "${context.templateName}"
- Niche: "${context.niche || 'General'}"
- Total Duration: ${context.targetLength || 0}s (${context.sceneCount || 0} scenes)
- Style/Trend Summary: "${context.strategySummary || ''}"
- Scenes Breakdown:
${(context.scenes || [])
  .map(
    (s: any) =>
      `  * Scene ${s.scene_number} (${s.duration_seconds}s): ${s.shot_type} | Text: "${s.text_overlay}" | Transition: ${s.transition_type} | Replaceable Media: ${s.media_is_editable ? 'Yes (User Slot)' : 'No (Fixed footage)'} | Replaceable Text: ${s.text_is_editable ? 'Yes (Editable placeholder)' : 'No (Fixed identity caption)'}`
  )
  .join('\n')}
${
  typeof context.activeSceneIndex === 'number'
    ? `- Currently Selected in Inspector: Scene ${context.activeSceneIndex + 1}`
    : ''
}
`;
  }

  const systemInstruction = `You are the CapCut Template Strategist & Creative Short-Form Director assistant.
Your role: Provide concrete, practical, and highly creative advice for TikTok, Reels, YouTube Shorts, and CapCut creators.
${contextSnippet}
Role and Behavior Instructions:
1. Always reference the creator's current template details (scenes, pacing, transitions, text overlays, and editable creator slots) when answering questions.
2. Provide concrete CapCut instructions: keyframe speed curves, optical flow velocity, transition duration tips, sound sync cues, and text styling tips.
3. Keep advice crisp, encouraging, and formatted with clean bullet points or numbered steps.
4. If asked to write hook variations, deliver punchy, high-CTR short-form captions suited for TikTok.
5. If asked about editability flags, remind creators how media_is_editable and text_is_editable affect user customization vs. brand identity.`;

  // If no Gemini API key configured, provide a context-aware fallback response
  if (!ai) {
    const lastUserMsg = messages[messages.length - 1]?.content || '';
    const templateName = context?.templateName || 'Active Template';
    const responseText = `I'm your CapCut Strategist Assistant! (Note: Running in offline mode because GEMINI_API_KEY is not configured).

Regarding your query "${lastUserMsg.slice(0, 80)}${lastUserMsg.length > 80 ? '...' : ''}" for "${templateName}":
- **Structure**: Your project has ${context?.sceneCount || 0} scenes over ${context?.targetLength || 0}s (avg ${(Number(context?.targetLength || 12) / Number(context?.sceneCount || 1)).toFixed(1)}s per scene).
- **Creator Slots**: You have ${context?.scenes?.filter((s: any) => s.media_is_editable).length || 0} user-replaceable media cuts and ${context?.scenes?.filter((s: any) => s.text_is_editable).length || 0} editable text captions.
- **CapCut Tip**: For maximum watch retention, keep your hook scene under 1.5s with a high-contrast kinetic caption and sync your fastest speed ramp to the primary audio snare.

Add a GEMINI_API_KEY in the Secrets panel to enable live multi-turn model dialogues with ${selectedModel}!`;

    res.json({ reply: responseText, modelUsed: selectedModel });
    return;
  }

  try {
    // Map messages to Gemini format
    const contents = messages.map((m: any) => ({
      role: m.role === 'model' ? 'model' : 'user',
      parts: [{ text: String(m.content || '') }],
    }));

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'I analyzed your CapCut template. How else can I assist with your edit?';
    res.json({ reply, modelUsed: selectedModel });
  } catch (error: any) {
    console.error('Error in chat generation via Gemini:', error);
    res.status(500).json({
      error: 'Gemini Chat failed: ' + (error?.message || 'Upstream error'),
      modelUsed: selectedModel,
    });
  }
});

// Mount Vite or static server
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('dist'));
} else {
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`CapCut Template Strategist server listening on http://0.0.0.0:${PORT}`);
});
