// Static export of the quick suggestions data
// This avoids issues with YAML parsing in test environments

export interface Suggestion {
  label: string;
  text: string;
}

export const quickSuggestions: Suggestion[] = [
  {
    label: "🎯 Epic Task Manager",
    text: "Create a stunning task management app with AI-powered natural language input that parses tasks, due dates, and priorities. Include drag-and-drop kanban boards, animated progress rings, streak tracking with fire emoji, achievement badges, and a beautiful stats dashboard with charts. Add keyboard shortcuts (Cmd+K), quick capture, and celebration confetti when tasks complete. Style with glass morphism cards, smooth staggered animations, and gradient accents.",
  },
  {
    label: "📸 AI Photo Gallery",
    text: "Build a gorgeous photo gallery with AI auto-tagging and smart search. Drag-and-drop images for instant upload with skeleton loading, then AI analyzes and adds tags/descriptions with smooth fade-in animations. Include masonry grid layout, lightbox with swipe gestures, facial recognition grouping, timeline view, and export as shareable collages. Add filters, batch operations, and a heatmap showing photo activity over time.",
  },
  {
    label: "💬 Legend Chat",
    text: "Create an immersive chat experience with historical figures and celebrities. Beautiful message bubbles with avatars, typing indicators, and smooth scroll. AI streams responses with character-accurate personalities. Include voice selection, conversation history with search, favorite quotes, and shareable conversation cards. Add ambient background music, character switching with smooth transitions, and a 'surprise me' random legend button.",
  },
  {
    label: "🎵 AI DJ Playlist",
    text: "Build a stunning music discovery app where you describe your mood and AI creates perfect playlists. Show animated album covers in a carousel, YouTube/Spotify links, and AI-generated playlist descriptions. Include mood-based color themes, shuffle with smooth transitions, save favorites, and share as beautiful playlist cards. Add music wave visualizations, genre mixing, and a 'vibe meter' that adjusts recommendations.",
  },
  {
    label: "💰 Wealth Dashboard",
    text: "Create a premium financial planning app with compound interest calculators, loan amortization, retirement projections, and investment tracking. Beautiful animated charts showing growth over time, goal progress rings, and milestone celebrations. Include scenario comparisons, tax optimization tips, and export as PDF reports. Style with sophisticated gradients, glass cards, and smooth number animations.",
  },
  {
    label: "🎨 Digital Canvas",
    text: "Build a full-screen painting app with natural pigment palette (ochre, ultramarine, vermillion, etc.), pressure-sensitive brush, undo/redo, layers, and blend modes. Add smooth brush strokes with canvas API, color mixing, save/load artwork, export as high-res PNG, and a gallery of your creations. Include zen mode with ambient sounds, brush size with slider, and satisfying paint splatter effects.",
  },
  {
    label: "👨‍🍳 Recipe AI Chef",
    text: "Create a delightful recipe generator using emoji ingredients (🥕🍅🧄). AI creates recipes with cooking steps, then an AI critic rates them with witty commentary. Show recipes as beautiful cards with ingredient lists, cooking time, difficulty badges, and save favorites. Add shopping list generation, dietary filters, random recipe button, and share as gorgeous recipe cards with food photography.",
  },
  {
    label: "📅 Smart Scheduler",
    text: "Build an intelligent meeting scheduler that analyzes availability from two people and finds optimal meeting times. Beautiful calendar visualization with color-coded time blocks, timezone support, and AI suggestions for best times. Include one-click calendar export, meeting duration presets, and conflict detection. Style with smooth animations, hover effects, and a clean modern interface.",
  },
  {
    label: "🌤️ Weather Mood",
    text: "Create a stunning weather app using National Weather Service API that renders the current sky as an animated CSS gradient. Show temperature, conditions, and forecast with beautiful icons. Add location search, hourly/weekly forecasts, weather alerts, and save favorite locations. Include sunrise/sunset times with animated transitions, feels-like temperature, and weather-appropriate background music.",
  },
  // {
  //   label: 'Guitar',
  //   text: "Create Hendrix-like guitar solos with Web Audio API: Set up oscillators (ctx.createOscillator()) with 'sawtooth' waveforms for guitar-like harmonics, use modulator.connect(modulationGain).connect(carrier.frequency) for expressive bends and feedback effects, create signature wah-wah with BiquadFilter (filter.frequency.setValueAtTime() + automated sweeps), simulate feedback using high modulationGain.gain values, achieve dramatic dives with carrier.frequency.exponentialRampToValueAtTime(), implement string bending/vibrato by modulating pitch with LFOs, create percussive attacks with gainNode.gain.linearRampToValueAtTime() for fast attack/sustain, and simulate whammy bar techniques with rapid frequency wobbles. Add distortion via WaveShaperNode with custom curves for that iconic fuzz tone, and schedule phrases with setTimeout()/Math.random() for human-like timing variations in pentatonic patterns. Average carrier wave around 1kHz, note density: rests are rare.",
  // },
  {
    label: "⏱️ Focus Timer Pro",
    text: "Build a beautiful pomodoro timer with multiple concurrent timers, work/break intervals, and session analytics. Show animated progress rings, streak tracking, productivity stats with charts, and ambient focus sounds. Include keyboard shortcuts, notification sounds, session history, and achievement badges. Persist timer state so refreshing doesn't lose progress. Add focus mode that dims everything except the timer, and celebration animations on session completion.",
  },
  {
    label: "🌓 Zen Toggle",
    text: "Create a mesmerizing minimalist experience: a single elegant checkbox that smoothly transitions the entire page between pristine white and deep black with a satisfying animation. Add smooth color transitions (1s ease), subtle scale effect on the checkbox, and optional ambient sound on toggle. Include keyboard shortcut (spacebar), click ripple effect, and a counter showing total toggles. Make it feel premium and satisfying.",
  },
  {
    label: "🌊 Ocean Colors",
    text: "Build a stunning maritime color picker with ocean-inspired palettes (turquoise, navy, seafoam, coral). AI names your custom colors with poetic descriptions. Type color names and AI generates the perfect shade. Show color history, save favorites, export palettes, and generate harmonious color schemes. Include gradient preview, hex/rgb/hsl values, and beautiful ocean wave animations in the background.",
  },
  {
    label: "🏔️ Literary Landscapes",
    text: "Create an immersive app showcasing famous landscape descriptions from American literature (Thoreau, Steinbeck, Cather). Beautiful typography with the quotes, then AI generates stunning landscape images matching the descriptions. Include author info, book context, save favorites, and create shareable quote cards with the generated imagery. Add smooth transitions between landscapes and ambient nature sounds.",
  },
  {
    label: "🐱 Emoji Cat Studio",
    text: "Build a delightful cat portrait generator with an emoji picker board. Select an emoji and AI creates a photorealistic orange Persian tabby cat portrait incorporating that emoji in creative ways. Show generation progress with animated loading, save to gallery, share portraits, and rate favorites. Include different cat breeds, style variations, and a surprise me button. Add purr sound effects and smooth image transitions.",
  },
  {
    label: "🎹 Beat Sequencer",
    text: "Create a gorgeous 8-step music sequencer using Web Audio API with multiple instrument tracks (bass, drums, synth, melody). Visual grid with animated playhead, adjustable BPM, volume controls, and preset patterns. Include save/load compositions, export as audio, and visual waveforms. Add smooth animations, keyboard shortcuts for each step, and satisfying click sounds. Style with neon colors and glass morphism.",
  },
  {
    label: "🎮 Trivia Showdown",
    text: "Build an epic trivia game with AI-generated questions on any topic. Beautiful board game aesthetic with animated question cards, score tracking, streak bonuses, and leaderboards. AI judges answers with witty feedback. Include difficulty levels, category selection, multiplayer mode, and achievement badges. Add countdown timers with tension-building music, celebration effects for correct answers, and shareable score cards.",
  },
  {
    label: "🧱 Breakout Arcade",
    text: "Create a stunning full-screen brick breaker game with smooth physics, particle effects, and Web Audio sound effects. Paddle follows mouse/touch, ball bounces with realistic physics, and colorful bricks shatter with satisfying animations. Include power-ups (multi-ball, lasers, wide paddle), progressive difficulty, high score tracking, and level progression. Add screen shake on impacts, combo multipliers, and retro-futuristic styling.",
  },
  {
    label: "🃏 Memory Master",
    text: "Build a beautiful memory matching game with custom card designs, smooth flip animations, and satisfying sound effects. Include difficulty levels, themed card sets, timer challenges, and move counting. Add streak tracking, best time records, and celebration animations on completion. Style with gradient cards, glass morphism, and smooth transitions. Include hints system and undo last move.",
  },
  {
    label: "📚 Smart Flashcards",
    text: "Create an intelligent flashcard study app that generates cards on any topic using AI. Beautiful card flip animations, spaced repetition algorithm, progress tracking, and mastery levels. Include categories, search, import/export, and study statistics with charts. Add keyboard shortcuts, shuffle mode, and confidence ratings. Style with clean cards, smooth transitions, and motivational progress indicators.",
  },
  {
    label: "📹 ASCII Camera",
    text: "Build a mesmerizing live camera-to-ASCII art converter with adjustable character density, color modes, and contrast controls. Show side-by-side comparison, save snapshots, and record ASCII videos. Include different character sets, resolution presets, and export options. Add retro terminal styling, smooth frame updates, and the ability to use different cameras. Make it feel like a vintage computer terminal.",
  },
  {
    label: "🎨 3D Still Life",
    text: "Create a stunning 3D recreation of Cézanne's 'The Basket of Apples' using Three.js. Interactive camera controls, realistic lighting, and textured 3D models of apples, basket, and table. Include rotation animations, zoom controls, and different viewing angles. Add art history info, style variations (wireframe, clay render), and the ability to rearrange objects. Style with museum-quality presentation and smooth interactions.",
  },
  {
    label: "✨ Surprise Me!",
    text: "Generate an unexpected, creative, and delightful app that showcases unique interactions, beautiful design, and innovative features. Could be anything from a particle physics sandbox to an AI poetry generator to an interactive data visualization. Make it visually stunning with smooth animations, surprising interactions, and premium polish. The goal: make users say 'whoa, I didn't know that was possible!'",
  },
];
