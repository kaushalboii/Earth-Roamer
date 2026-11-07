# 🌟 Contributing to Earth Roamer (Human Free-Flight Simulator)

Thank you for your interest in contributing to **Earth Roamer**! 

### 🕊️ The Vision
Our goal is to build the world's most liberating, stress-free open-source Earth exploration experience:
> **A boundless sandbox where anyone on the planet can open their browser, take flight as an agile human, and roam anywhere on Earth at will—from rooftop gliding to Mach 20 hypersonic orbits.**

No health bars, no crash penalties, no timers. Just pure freedom, relaxation, and wonder.

---

## 🚀 How You Can Contribute

Whether you are a developer, 3D artist, sound designer, or passionate world explorer, there is a place for your ideas here.

### 1. 🌆 World & Landmarks
- Add new curated scenic destinations in [`src/config.js`](src/config.js) (Grand Canyon canyon runs, Swiss Alps soaring, Tokyo night roaming, etc.).
- Add historical facts or peaceful sightseeing rings/routes.

### 2. 🧍 3D Human Avatars & Animations
- Add customizable avatars (Spider-Suit, Casual Wingsuit, Superhero, Cyber-Runner).
- Integrate `.vrm` or Mixamo humanoid character loading so players can import their own avatars.
- Enhance human flight poses (deep diving, wing-tuck, acrobatic barrel rolls).

### 3. 🎵 Ambient Music & Soundscapes
- Expand the procedural Web Audio synthesizer in [`src/audio/AudioManager.js`](src/audio/AudioManager.js) with new peaceful ambient chords, wind harmonics, or binaural relaxation tones.
- Add environmental audio (ocean wave rumbles when skimming water, birdsong at low altitudes, wind chimes).

### 4. 🌤️ Weather & Atmospheric Effects
- Dynamic volumetric cloud layers.
- Rain and lightning storm cells.
- Aurora Borealis (Northern Lights) near polar latitudes.

### 5. 👥 Multiplayer Free-Roam
- WebRTC / WebSocket peer-to-peer multiplayer to let friends fly together across the globe in peace.

---

## 🛠️ Local Development Setup

```bash
# 1. Fork and clone the repository
git clone https://github.com/kaushalboii/Earth-Roamer.git
cd Earth-Roamer

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Generate 3D Character Model (if modifying model script)
npm run generate-model

# 5. Build for production
npm run build
```

---

## 📜 Pull Request Guidelines

1. **Keep it Stress-Free**: Ensure all gameplay mechanics remain empowering, smooth, and enjoyable.
2. **Performance First**: The simulator streams global 3D tiles; ensure changes maintain smooth 60 FPS in WebGL.
3. **Cross-Platform**: Test on desktop and touch devices where possible.

Welcome to the team. Let's build the dream flying simulator together! 🌍✨

