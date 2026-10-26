import { CapCutTemplateStrategy } from '../types/template';

export const PRESET_TEMPLATES: CapCutTemplateStrategy[] = [
  {
    niche: 'Streetwear & GRWM (Get Ready With Me)',
    target_length_seconds: 12,
    aspect_ratio: '9:16',
    schema_version: '1.0',
    generation_mode: 'offline',
    template_name: 'Snappy Fit Check • Velocity Flash',
    trend_summary: 'Hyper-engaging 12-second wardrobe breakdown synchronized to a phonk or sped-up bass kick. Starts with an unfinished outfit hook, snaps through 7 rapid product layers, and ends on a hero silhouette turnaround with 3D zoom.',
    trending_audio_category: 'Sped-up Jersey Club / Brazilian Phonk / Lo-fi Trap Beat',
    recommended_audio_tracks: [
      'Montagem Mysterious Game (Sped Up)',
      'METAMORPHOSIS (Jersey Remix)',
      'Neverita Club Beat (CapCut Cut)'
    ],
    pacing: {
      tempo: 'High-Tempo / Velocity Beat Drop',
      bpm_range: '136 - 142 BPM',
      cut_frequency: 'Every 0.45s on drop; 1.2s on opening hook',
      description: 'Intro holds for 1.2s for outfit preview, then drops into 0.45s rapid snap cuts matching each shoe/accessory kick drum.'
    },
    scene_count: 7,
    scenes: [
      {
        scene_number: 1,
        duration_seconds: 1.2,
        start_time: 0,
        end_time: 1.2,
        shot_type: 'Full Body Low-Angle (Unstyled / Plain clothes)',
        visual_action: 'Creator stands with base layer, points directly at screen before doing a sudden heel stomp.',
        transition_type: 'Stomp Camera Shake + Flash White',
        text_overlay: 'Rating my winter streetwear rotation 👟',
        text_animation_style: 'Typewriter with Green Neon Border',
        audio_cue: 'Bass riser building to first 808 drop',
        capcut_preset_tip: 'Apply "Camera Shake 2" keyframed to 100 intensity at 1.1s.',
        media_is_editable: true,
        text_is_editable: true
      },
      {
        scene_number: 2,
        duration_seconds: 0.9,
        start_time: 1.2,
        end_time: 2.1,
        shot_type: 'Macro Close-Up on Footwear / Sneaker Box',
        visual_action: 'Quick unboxing kick or snap drop of retro sneakers onto clean rug.',
        transition_type: 'Whip Pan Right',
        text_overlay: 'Base: Vintage Sambas / Dunks',
        text_animation_style: 'Slide Up + 15% Motion Blur',
        audio_cue: 'Crisp Snare Hit #1',
        capcut_preset_tip: 'Enable CapCut "Smart Motion Blur" set to 60 Blur, 4 Once.',
        media_is_editable: true,
        text_is_editable: true
      },
      {
        scene_number: 3,
        duration_seconds: 0.8,
        start_time: 2.1,
        end_time: 2.9,
        shot_type: 'Medium Shot (Pants / Trousers fit drape)',
        visual_action: 'Hand smoothing heavy-weight denim pleats with natural fabric sound.',
        transition_type: 'Glitch Chromatic Aberration',
        text_overlay: 'Wide Leg Cargo • Raw Denim',
        text_animation_style: 'Spring Bounce In',
        audio_cue: 'Hi-Hat Roll 16th notes',
        capcut_preset_tip: 'Add "Glitch Overlay 03" with 30% opacity on transition frame.',
        media_is_editable: true,
        text_is_editable: true
      },
      {
        scene_number: 4,
        duration_seconds: 0.8,
        start_time: 2.9,
        end_time: 3.7,
        shot_type: 'Close-Up (Heavyweight Hoodie / Knitwear)',
        visual_action: 'Throwing hoodie over shoulders or pulling down zipper in one swift motion.',
        transition_type: 'Zoom In Whip Cut',
        text_overlay: 'Boxy 450 GSM Knit',
        text_animation_style: 'Pop-Up Kinetic Font',
        audio_cue: 'Sub-Bass Pulse',
        capcut_preset_tip: 'CapCut "Optical Flow" 2x speed ramp down to 0.5x.',
        media_is_editable: true,
        text_is_editable: true
      },
      {
        scene_number: 5,
        duration_seconds: 0.8,
        start_time: 3.7,
        end_time: 4.5,
        shot_type: 'Detail Macro (Jewelry, Cap, Rings & Fragrance)',
        visual_action: 'Adjusting vintage silver rings and misting fragrance towards lens.',
        transition_type: 'Flash Black + Lens Flare',
        text_overlay: 'Accessories & Amber Wood Cologne',
        text_animation_style: 'Fade In with Golden Glow',
        audio_cue: 'Percussion Click & Metallic Ting',
        capcut_preset_tip: 'Use "Retro Film Glow" preset with Soften: 45.',
        media_is_editable: true,
        text_is_editable: true
      },
      {
        scene_number: 6,
        duration_seconds: 3.5,
        start_time: 4.5,
        end_time: 8.0,
        shot_type: 'Hero Medium-Full Angle (Completed Fit Lookbook)',
        visual_action: 'Slow-motion 360 spin, hands in pockets, looking off-camera with relaxed posture.',
        transition_type: 'Smooth Cross Dissolve',
        text_overlay: 'Final Silhouette: Cop or Drop? 👇',
        text_animation_style: 'Pulsing Bottom-Centered Pill with CTA',
        audio_cue: 'Main Melody Chorus Drops with Heavy Reverb',
        capcut_preset_tip: 'Apply "Velocity Curve: Flash In" (Speed 1.5x down to 0.3x).',
        media_is_editable: true,
        text_is_editable: false
      },
      {
        scene_number: 7,
        duration_seconds: 4.0,
        start_time: 8.0,
        end_time: 12.0,
        shot_type: 'Outdoor Street Context Walk-Away (Looping clip)',
        visual_action: 'Walking away towards sunset or concrete architecture, turns head back at camera at end frame to form seamless loop.',
        transition_type: 'Loop Match Cut to Scene 1',
        text_overlay: 'Links in bio 🏷️ #GRWM #streetwear',
        text_animation_style: 'Subtle Fade Out',
        audio_cue: 'Reverb Tail Fade with Beat Loop back to Bar 1',
        capcut_preset_tip: 'Match the final walking frame with opening stance for 100% loop completion rate.',
        media_is_editable: true,
        text_is_editable: true
      }
    ],
    transition_types: [
      'Stomp Camera Shake + Flash White',
      'Whip Pan Right',
      'Glitch Chromatic Aberration',
      'Zoom In Whip Cut',
      'Flash Black + Lens Flare',
      'Velocity Curve Drop',
      'Loop Match Cut'
    ],
    text_animation_style: {
      style_name: 'Kinetic Streetwear Bold',
      font_recommendation: 'The Bold Font / Futura Heavy / Anton',
      animation_preset: 'Spring Bounce In + Track Tracking 1.1x',
      color_and_effects: 'Pure White with 40% Drop Shadow, 2px Solid Black Stroke, Lime Accent',
      placement_tip: 'Safe zone: 35% from bottom, centered horizontally.'
    },
    viral_hook_tactics: [
      'First 0.8s physical movement (heel stomp) resets viewer attention immediately',
      'BPM-synchronized snap cuts prevent drop-off between seconds 2 and 6',
      'Seamless loop cut makes 12-second video loop 2.2x on average, boosting algorithmic push'
    ],
    capcut_effect_recommendations: [
      'Smart Motion Blur (Blur 60, Blend 45)',
      'Auto-Velocity with Smooth Slow-mo',
      'Chromatic Split 2 on drop',
      'Film Grain 1998 (12% subtle)'
    ]
  },
  {
    niche: 'Travel Cinematic Vlog',
    target_length_seconds: 15,
    aspect_ratio: '9:16',
    schema_version: '1.0',
    generation_mode: 'offline',
    template_name: '3D Golden Hour Drone & Horizon Drift',
    trend_summary: 'Atmospheric, cinematic 15-second wanderlust template. Combines swooping FPV drone landscapes with intimate street glimpses, timed to an ambient acoustic or chill electronic swell with whoosh transitions.',
    trending_audio_category: 'Ambient Cinematic Chillwave / ODESZA Style Synth / Acoustic Fingerstyle',
    recommended_audio_tracks: [
      'Say My Name (Slowed Acoustic Sunset)',
      'Summer Nostalgia Piano (CapCut Viral Sound)',
      'Golden Hour Ambient Strings'
    ],
    pacing: {
      tempo: 'Fluid Mid-Tempo with Sudden Rhythm Accelerations',
      bpm_range: '108 - 116 BPM',
      cut_frequency: 'Long 2.4s scenic openers, accelerating to 1.1s cuts on the hook',
      description: 'Begins with wide awe-inspiring view, accelerates as explorer steps into frame, culminates in sunset drone rise.'
    },
    scene_count: 6,
    scenes: [
      {
        scene_number: 1,
        duration_seconds: 2.8,
        start_time: 0,
        end_time: 2.8,
        shot_type: 'Ultra-Wide Horizon Sunrise (FPV or Dolly Push)',
        visual_action: 'Slow gliding push over turquoise ocean or mountain ridge with morning mist.',
        transition_type: 'Mask Wipe (Mountain Edge or Tree Silhouette)',
        text_overlay: 'This is your sign to book that flight ✈️',
        text_animation_style: 'Cinematic Fade In with Letter-Spacing Expansion',
        audio_cue: 'Warm synthesizer pad swell + ocean breeze FX',
        capcut_preset_tip: 'Apply "Nature Teal & Orange" LUT with 65% intensity.',
        media_is_editable: true,
        text_is_editable: false
      },
      {
        scene_number: 2,
        duration_seconds: 1.8,
        start_time: 2.8,
        end_time: 4.6,
        shot_type: 'POV Action (Stepping out of train or vintage convertible)',
        visual_action: 'First-person perspective opening wooden shutter door to expose coastal view.',
        transition_type: 'Optical Zoom Through Door',
        text_overlay: 'Found the most unreal hidden cove...',
        text_animation_style: 'Subtle Typewriter Minimal',
        audio_cue: 'Acoustic guitar strum + door click audio sync',
        capcut_preset_tip: 'Use CapCut "Camera Move: In 2" to amplify door opening.',
        media_is_editable: true,
        text_is_editable: true
      },
      {
        scene_number: 3,
        duration_seconds: 2.0,
        start_time: 4.6,
        end_time: 6.6,
        shot_type: 'Intimate Culture / Local Food Steam Shot',
        visual_action: 'Street food vendor tossing wok noodles with steam rising into neon sign.',
        transition_type: 'Smoke Particle Dissolve',
        text_overlay: 'Street night markets in Hanoi 🍜',
        text_animation_style: 'Soft Blur In + Gentle Settle',
        audio_cue: 'Sizzle audio + ambient laughter background layer',
        capcut_preset_tip: 'CapCut "Food Warmth" filter + 50fps slowed to 0.6x.',
        media_is_editable: true,
        text_is_editable: true
      },
      {
        scene_number: 4,
        duration_seconds: 2.2,
        start_time: 6.6,
        end_time: 8.8,
        shot_type: 'Medium Tracking Shot (Subject running towards cliff edge)',
        visual_action: 'Subject in flowing linen turns smiling back towards camera while walking towards ocean view.',
        transition_type: 'Light Leak Flare Right',
        text_overlay: 'No itinerary. Just vibes.',
        text_animation_style: 'Elegant Serif Slide',
        audio_cue: 'Snare buildup with rising violin vibrato',
        capcut_preset_tip: 'Overlay "Sunlight Leak 04" set to Screen blending mode.',
        media_is_editable: true,
        text_is_editable: true
      },
      {
        scene_number: 5,
        duration_seconds: 3.2,
        start_time: 8.8,
        end_time: 12.0,
        shot_type: 'Hero Golden Hour Drone Pull-Away',
        visual_action: 'Camera launches backward into sky, revealing dramatic cliffs and tiny silhouettes of lovers.',
        transition_type: 'Motion Blur Spin',
        text_overlay: 'Save this spot for 2026 📍 (Coordinates in caption)',
        text_animation_style: 'Centered Floating Card with Glassmorphism',
        audio_cue: 'Euphoric chorus drop with expansive bass',
        capcut_preset_tip: 'Apply CapCut "3D Zoom Pro" for subtle parallax depth.',
        media_is_editable: true,
        text_is_editable: false
      },
      {
        scene_number: 6,
        duration_seconds: 3.0,
        start_time: 12.0,
        end_time: 15.0,
        shot_type: 'Night Campfire / Candle Glow Reflection (Loop closer)',
        visual_action: 'Toasting glasses around beach fire, sparks drifting up toward the stars.',
        transition_type: 'Gentle Fade to Morning Sky (Seamless Loop)',
        text_overlay: 'Where are you traveling next?',
        text_animation_style: 'Clean Sans Fade',
        audio_cue: 'Fire crackle + soft fading acoustic chord',
        capcut_preset_tip: 'Color grading: Add "Warm Amber" + Film Vignette 20%.',
        media_is_editable: true,
        text_is_editable: true
      }
    ],
    transition_types: [
      'Mask Wipe (Natural Element)',
      'Optical Zoom Through Door',
      'Smoke Particle Dissolve',
      'Light Leak Flare Right',
      'Motion Blur Spin',
      'Seamless Loop Fade'
    ],
    text_animation_style: {
      style_name: 'Luxury Editorial Serif',
      font_recommendation: 'Playfair Display / Bodoni Poster / Cormorant',
      animation_preset: 'Cinematic Slow Drift In + Tracking Space Out',
      color_and_effects: 'Warm Ivory (#FDFBF7) with 30% Soft Gaussian Blur Shadow',
      placement_tip: 'Upper-center third to avoid TikTok engagement icons.'
    },
    viral_hook_tactics: [
      'Visual curiosity hook ("This is your sign to book...") creates instant emotional FOMO',
      'High production value aesthetic stops scrolling immediately within 0.5s',
      'Explicit Save CTA ("Save this spot for 2026") triggers algorithmic save weight'
    ],
    capcut_effect_recommendations: [
      '3D Zoom Pro',
      'Teal & Orange LUT (Intensity 70)',
      'Sunlight Ray Leak Overlay',
      'Optical Flow 50% Slow Motion'
    ]
  },
  {
    niche: 'Fitness & Physique Transformation',
    target_length_seconds: 10,
    aspect_ratio: '9:16',
    schema_version: '1.0',
    generation_mode: 'offline',
    template_name: 'Auto-Velocity PR Hit • Bass Drop Reveal',
    trend_summary: 'High-intensity 10-second gym edit designed for personal record (PR) lifts, physique transformation reveals, or pump checks. Utilizes CapCut auto-velocity curve sync where speed ramps slow down at the bottom of the rep and explode at lockout.',
    trending_audio_category: 'Hardstyle Phonk / Industrial Cyberpunk Techno / Rage Trap',
    recommended_audio_tracks: [
      'BRAZILIAN DANÇA PHONK (Slowed + Reverb)',
      'RAVE - Dxrk ダーク',
      'Vivid Gym Drop (CapCut Official Sound)'
    ],
    pacing: {
      tempo: 'Ultra-Fast Velocity Ramp (Aggressive Beat Drops)',
      bpm_range: '145 - 155 BPM',
      cut_frequency: '0.3s micro-cuts on drop; 1.5s setup',
      description: 'Tense preparation for 2.0s, bar unrack at 2.5s, explosive velocity curve hitting peak muscle contraction on the bass slam.'
    },
    scene_count: 5,
    scenes: [
      {
        scene_number: 1,
        duration_seconds: 2.2,
        start_time: 0,
        end_time: 2.2,
        shot_type: 'Extreme Close-Up (Chalk cloud clapping / Hand wrapping)',
        visual_action: 'Lifter claps chalk off hands; white powder explodes in dark gym lighting.',
        transition_type: 'Particle Boom + Black Flash',
        text_overlay: 'They said 405 lbs was impossible at 170 bw...',
        text_animation_style: 'Strobe Flicker Red/White',
        audio_cue: 'Heartbeat audio loop accelerating + muffled muffled bass',
        capcut_preset_tip: 'Apply "Monochrome Grunge" with "Chalk Glow" contrast +15.',
        media_is_editable: true,
        text_is_editable: true
      },
      {
        scene_number: 2,
        duration_seconds: 1.4,
        start_time: 2.2,
        end_time: 3.6,
        shot_type: 'Low-Angle Side View (Barbell bending under load)',
        visual_action: 'Tight grip on knurling, deep breath in, eyes locked on mirror.',
        transition_type: 'Camera Jitter Shake',
        text_overlay: 'Watch the lockout 😤',
        text_animation_style: 'High Impact Stamp Down',
        audio_cue: 'Deep audible intake of breath + silence just before drop',
        capcut_preset_tip: 'CapCut "Camera Shake: Jitter" at 80 intensity for 0.4s.',
        media_is_editable: true,
        text_is_editable: true
      },
      {
        scene_number: 3,
        duration_seconds: 2.8,
        start_time: 3.6,
        end_time: 6.4,
        shot_type: 'Front Center Full Lifter Shot (The Rep)',
        visual_action: 'Rep begins at normal speed, velocity ramps down to 0.2x at sticking point, bar snaps to lockout with explosion.',
        transition_type: 'Flash White + Edge Glow',
        text_overlay: '405 LBS PR LOCKED IN 🔥',
        text_animation_style: 'Kinetic 3D Pop Out',
        audio_cue: 'EXPLOSIVE 808 BASS DROP & Crowd Scream',
        capcut_preset_tip: 'CapCut Curve Velocity: Custom (Points: 1.0x -> 0.2x -> 4.0x on lockout).',
        media_is_editable: true,
        text_is_editable: false
      },
      {
        scene_number: 4,
        duration_seconds: 1.8,
        start_time: 6.4,
        end_time: 8.2,
        shot_type: 'Back Lat Spread / Shoulder Pump Check',
        visual_action: 'Dropping barbell to platform, turning around flex with back muscles striations visible in spotlight.',
        transition_type: 'Glitch RGB Split',
        text_overlay: '6 months of consistency > talent',
        text_animation_style: 'Smooth Slide In Left',
        audio_cue: 'Hardstyle kick drum roll',
        capcut_preset_tip: 'Enable "HDR Body Glow" filter to bring out muscle definition.',
        media_is_editable: true,
        text_is_editable: true
      },
      {
        scene_number: 5,
        duration_seconds: 1.8,
        start_time: 8.2,
        end_time: 10.0,
        shot_type: 'Smug Smile / Shaking Head at Camera (Loop trigger)',
        visual_action: 'Creator smiles, unclasps belt, drops it on floor, walks toward camera to cover lens.',
        transition_type: 'Hand Over Lens Cut to Scene 1 Chalk',
        text_overlay: 'What’s your current goal? Drop it below 👇',
        text_animation_style: 'Pulsing Text CTA',
        audio_cue: 'Siren sound FX fade with continuing bassline',
        capcut_preset_tip: 'Covering lens allows perfect black match cut back to Chalk clap.',
        media_is_editable: true,
        text_is_editable: true
      }
    ],
    transition_types: [
      'Particle Boom + Black Flash',
      'Camera Jitter Shake',
      'Flash White + Edge Glow',
      'Glitch RGB Split',
      'Hand Over Lens Loop Cut'
    ],
    text_animation_style: {
      style_name: 'Aggressive Industrial Bold',
      font_recommendation: 'Impact / Montserrat ExtraBold / Oswald',
      animation_preset: 'Stamp Down + Quick Shake on Impact',
      color_and_effects: 'Pure White with Crimson Red Glow / Neon Orange Drop Shadow',
      placement_tip: 'Center top, above barbell path to ensure barbell motion remains clear.'
    },
    viral_hook_tactics: [
      'Doubt/Challenge hook ("They said 405 was impossible") spikes retention through completion to see if they succeed',
      'Audio silence right before the drop creates dopamine tension and release',
      'Hand over lens loop cut boosts re-watch loops dramatically'
    ],
    capcut_effect_recommendations: [
      'Custom Velocity Curve with Optical Flow',
      'Camera Shake 2 & 3',
      'Edge Glow Neon',
      'RGB Split Glitch 01'
    ]
  }
];
