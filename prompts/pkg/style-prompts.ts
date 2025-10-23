export interface StylePrompt {
  name: string;
  prompt: string;
}

export const stylePrompts: StylePrompt[] = [
  // "brutalist web" remains the intended default. The default is now selected by name
  // (see DEFAULT_STYLE_NAME below), not by array order. Order here only affects UI
  // suggestion ordering in Settings.
  {
    name: "brutalist web",
    prompt:
      'Create a modern neo-brutalist UI: bold, confident, and unapologetically functional. Use blocky geometry with thick 4-8px borders (border-4 border-8), oversized interactive elements, and dramatic hard shadows (shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]). Buttons should have bold offset shadows that compress on click. Use a clean graph-paper background: base #f1f5f9 with subtle grid lines via repeating-linear-gradient. Add a light grain texture overlay at 3-5% opacity for tactile feel. Corner rule: elements are either sharp (rounded-none) or fully rounded (rounded-full) - no in-between. Use high-contrast color palette: #f1f5f9 (background), #cbd5e1 (borders), #94a3b8 (secondary), #64748b (text), #0f172a (primary), #242424 (dark text), #ffffff (surfaces). Typography: bold headings (font-bold text-2xl), clear hierarchy, generous spacing (space-y-6 space-y-8). Layout: mobile-first single column, expanding to asymmetric 2-3 column grids on larger screens. All interactive elements must be >= 48px tall for accessibility. Use sticky headers and bottom navigation. Add micro-interactions: hover lifts elements slightly, active states compress shadows. Secret name: "Neobrute Blueprint".',
  },
  {
    name: "memphis",
    prompt:
      "Create a vibrant Memphis Group-inspired UI: playful, bold, and joyfully postmodern. Use geometric shapes (circles, triangles, squiggles) as decorative elements and dividers. Implement a charming patterned background with Memphis-style dots, zigzags, or squiggly lines using CSS gradients or SVG patterns. Color palette: #70d6ff (cyan), #ff70a6 (pink), #ff9770 (coral), #ffd670 (yellow), #e9ff70 (lime), #242424 (text), #ffffff (surfaces). Use thick 4-6px borders (border-4 border-6) in contrasting colors for neo-brutalist clarity. Create asymmetric layouts with unexpected element placement. Typography: bold, chunky headings (font-black text-3xl) with playful spacing. Add terrazzo-style textures to backgrounds. Mix rounded (rounded-2xl) and angular (rounded-none) elements for visual interest. Use high contrast - light backgrounds with dark text only. Buttons should be oversized and colorful with thick borders. Add subtle rotation (rotate-1 -rotate-2) to some elements for dynamism. Include decorative geometric shapes as visual accents. Ensure all text is highly legible with strong contrast. Secret name: 'Memphis Alchemy'.",
  },
  {
    name: "synthwave",
    prompt: "Create a retro-futuristic synthwave UI: neon colors on dark backgrounds with 1980s digital aesthetics. Use gradient backgrounds (from-purple-900 via-pink-900 to-orange-900), neon accent colors (#ff00ff, #00ffff, #ff0080, #00ff00), and glowing effects (shadow-[0_0_20px_rgba(255,0,255,0.5)]). Add scan lines or grid patterns reminiscent of Tron. Typography: bold, futuristic fonts with text shadows and neon glow effects. Use rounded corners (rounded-lg rounded-xl) and smooth gradients. Buttons should glow on hover. Include subtle animations like pulsing glows or floating elements. Dark base (#0a0a1f, #1a1a2e) with vibrant neon accents. Add retro computer terminal aesthetics where appropriate.",
  },
  {
    name: "organic UI",
    prompt: "Create a natural, organic UI with fluid, biomorphic forms. Use soft, rounded shapes (rounded-3xl rounded-full), gentle curves, and flowing layouts. Color palette inspired by nature: earth tones (#8b7355, #a0826d), plant greens (#4a7c59, #6b9080), sky blues (#89b0ae, #bee3db), warm neutrals (#f4f1de, #e4dccf). Implement smooth, wave-like dividers between sections. Use soft shadows (shadow-lg shadow-xl) and subtle gradients. Typography: friendly, rounded fonts with generous line height. Add organic textures or patterns. Buttons should have soft, pill-like shapes. Include gentle animations like breathing effects or flowing transitions. Create asymmetric, natural-feeling layouts that avoid rigid grids.",
  },
  {
    name: "maximalist",
    prompt: "Create a bold maximalist UI: more is more. Layer multiple patterns, textures, and decorative elements. Use rich, saturated colors with high contrast. Implement ornate borders, decorative flourishes, and abundant visual details. Mix multiple font styles and sizes for dramatic hierarchy. Add background patterns, gradients, and textures simultaneously. Use thick borders (border-4 border-8), drop shadows, and multiple layers. Include decorative icons, badges, and embellishments. Create dense, information-rich layouts with multiple visual focal points. Use vibrant color combinations and don't shy away from clashing colors. Add animations, transitions, and interactive flourishes. Typography: mix of bold, italic, and decorative styles. Ensure functionality isn't lost in the abundance - maintain clear interactive elements and readable text.",
  },
  {
    name: "skeuomorphic",
    prompt: "Create a realistic skeuomorphic UI that mimics real-world materials and objects. Use detailed shadows (shadow-inner shadow-2xl), gradients, and textures to create depth and dimension. Implement realistic button states: raised when idle, pressed when active. Use material textures: leather, wood, metal, glass, paper. Add subtle highlights and reflections. Typography: crisp and clear with subtle text shadows for depth. Use realistic color palettes based on physical materials. Buttons should look tactile and pressable with beveled edges. Include realistic icons and interface elements. Add subtle noise textures for material feel. Use proper lighting effects: highlights on top, shadows on bottom. Create depth with layered elements and proper z-axis spacing.",
  },
  {
    name: "flat design",
    prompt: "Create a clean, minimal flat design UI: simple, 2D, and focused on usability. Use solid colors without gradients or shadows. Implement simple geometric shapes with clean edges. Color palette: bright, saturated colors (#3498db, #e74c3c, #2ecc71, #f39c12, #9b59b6) on white or light gray backgrounds. Typography: clean sans-serif fonts with clear hierarchy. Use ample white space and generous padding. Buttons are simple rectangles or rounded rectangles with solid colors. Icons should be simple, line-based, or solid shapes. Avoid textures, shadows, and 3D effects. Focus on typography and color for visual hierarchy. Use subtle hover states with color changes only. Create grid-based, organized layouts with clear sections.",
  },
  {
    name: "bauhaus",
    prompt: "Create a Bauhaus-inspired UI: geometric, functional, and modernist. Use primary colors (red, blue, yellow) with black, white, and gray. Implement strong geometric shapes: circles, squares, triangles. Create asymmetric, grid-based layouts with mathematical precision. Typography: clean, sans-serif fonts (font-sans) with strong hierarchy. Use bold lines and shapes as dividers. Emphasize function over decoration. Color blocking with solid colors, no gradients. Use geometric patterns sparingly. Buttons are simple geometric shapes with clear purpose. Include strong horizontal and vertical lines. Create balance through asymmetry. Use the golden ratio for proportions. Add subtle geometric decorative elements. Maintain high contrast and clarity.",
  },
  {
    name: "glitchcore",
    prompt: "Create a glitchy, digital-error aesthetic UI: intentionally broken and decentered. Use RGB color splitting effects, distorted text, and offset layers. Implement glitch animations: flickering, shifting, color aberration. Color palette: neon colors (#00ff00, #ff00ff, #00ffff) with black backgrounds and white noise. Add scan line effects, pixelation, and digital artifacts. Typography: distorted, offset, or corrupted text effects. Use unexpected layouts that break conventional design rules. Include random geometric shapes and lines. Buttons may appear broken but remain functional. Add static noise backgrounds or animated glitch effects. Use monospace fonts for terminal aesthetics. Create intentional misalignments and overlaps. Ensure core functionality remains clear despite chaotic aesthetics.",
  },
  {
    name: "paper cutout",
    prompt: "Create a layered paper cutout UI: tactile, dimensional, and crafted. Use multiple layers with distinct shadows to create depth (shadow-md shadow-lg shadow-xl). Implement paper-like textures and subtle grain. Color palette: soft, muted colors like construction paper (#f4a261, #e76f51, #2a9d8f, #264653, #e9c46a) on cream or white backgrounds. Add torn or rough edges using custom borders. Typography: friendly, handwritten-style or clean sans-serif fonts. Use offset layers for depth effect. Buttons should look like raised paper elements. Include subtle rotation (rotate-1 -rotate-2) for hand-placed feel. Add drop shadows that suggest physical layers. Create collage-like layouts with overlapping elements. Use rounded corners (rounded-lg) for paper-like softness. Include decorative paper shapes as accents.",
  },
  {
    name: "viridian",
    prompt:
      "Create a vibrant UI theme inspired by Bruce Sterling's Viridian Design Movement, embracing a futuristic green aesthetic with subtle animations and dynamic interactivity. Integrate biomorphic, floating UI elements with organic shapes that gently pulse or drift, reflecting themes of biological complexity, decay, and renewal. Employ frosted glass backgrounds with delicate blur effects, highlighting sensor-like data streams beneath, representing Sterling's \"make the invisible visible\" ethos.\n\nUse gradients and layers of soft greens accented by energetic data-inspired colors (#70d6ff, #ff70a6, #ff9770, #ffd670, #e9ff70), alongside crisp white (#ffffff) and dark contrast (#242424), ensuring legibility and visual appeal. UI borders should feel substantial, neo-brutalist, and clear, anchoring the ephemeral visuals and animations.\n\nThe background should subtly animate, evoking cellular activity, digital pulse, or ecological sensor feedback, reinforcing Viridian's fascination with tangible cyberspace and biomorphic tech aesthetics.\n\nSecretly name this theme \"Viridian Pulse\", capturing Sterling's original playful-yet-serious blend of provocative futurism and stylish eco-consciousness.",
  },
];

// Explicit default selection (stable regardless of array order)
export const DEFAULT_STYLE_NAME = "brutalist web" as const;

// Build a name → style map once and enforce uniqueness to avoid subtle bugs
const nameToStyle = new Map<string, StylePrompt>();
for (const s of stylePrompts) {
  if (nameToStyle.has(s.name)) {
    throw new Error(
      `Duplicate style name detected: "${s.name}". Style names must be unique.`,
    );
  }
  nameToStyle.set(s.name, s);
}

// Derive the default prompt via map lookup (order-independent)
export const defaultStylePrompt = (() => {
  const entry = nameToStyle.get(DEFAULT_STYLE_NAME);
  if (!entry) {
    const available = Array.from(nameToStyle.keys()).join(", ");
    throw new Error(
      `DEFAULT_STYLE_NAME "${DEFAULT_STYLE_NAME}" not found in stylePrompts. Available names: ${available}. Update DEFAULT_STYLE_NAME or the style list.`,
    );
  }
  return entry.prompt;
})();
