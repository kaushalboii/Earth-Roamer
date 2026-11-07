# 🌍 Earth Roamer // Human Free-Flight Simulator (Mach 20)

[![Deploy to GitHub Pages](https://github.com/kaushalboii/Earth-Roamer/actions/workflows/deploy.yml/badge.svg)](https://github.com/kaushalboii/Earth-Roamer/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Built with CesiumJS](https://img.shields.io/badge/CesiumJS-1.127-orange.svg)](https://cesium.com/platform/cesiumjs/)
[![Open Source Love](https://img.shields.io/badge/Open%20Source-Dream%20Project-green.svg)](CONTRIBUTING.md)

> *"A stress-free, open-source Earth-scale human flying sandbox. Free to roam, explore, unwind, and dream."*

An open-source browser simulator where you control an agile **human flyer** roaming freely across the entire real-world Earth—from skimming skyscrapers and ocean waves like Spider-Man with web-wings to accelerating up to **Mach 20 (~24,700 km/h)** to orbit the planet.

No aircraft, no cockpits, no health bars, no crash penalties. Just pure human flight, organic diving and swooping momentum, soothing ambient soundscapes, and boundless freedom to wander the world.

---

## 🌐 Live Demo

Play directly in your browser on GitHub Pages:
**`https://kaushalboii.github.io/Earth-Roamer/`**

---

## ✨ Features

- **🧍 True Human Flight Dynamics**:
  - **Spider-Man Style Kinetic Diving & Swooping**: Dive head-first down avenues and mountain gorges to convert potential gravity into speed, then pull up to swoop high above the clouds!
  - **Acrobatic Banking**: Body tilts, leans, and glides naturally into aerodynamic turns.
  - **Ground Skimming Cushion**: Skim effortlessly just meters above rooftops, street canyons, forests, and ocean surf without colliding or getting stuck.
  - **Floating Hover**: When you stop, the human floats serenely in place with gentle breathing oscillations.
- **⚡ From Gentle Roaming to Hypersonic Mach 20**:
  - **Hover (`1`)**: 30 km/h — Gentle floating and street-level exploration.
  - **Glide (`2`)**: 250 km/h — Spider-Man web-wing style cruising between buildings.
  - **Fast Soaring (`3`)**: 800 km/h — Continental transit speed.
  - **Mach 1.0 (`4`)**: 1,235 km/h — Breaks the sound barrier with an expanding Prandtl-Glauert vapor shockwave ring and sonic boom!
  - **Mach 5.0 (`5`)**: 6,175 km/h — Hypersonic flight.
  - **Mach 10.0 (`6`)**: 12,350 km/h — Re-entry plasma ionization trail.
  - **Mach 20.0 (`0` or `M`)**: 24,700 km/h — Superhuman God-Speed: complete globe orbit in ~90 minutes!
- **🌿 Stress-Free Zen Mode (`Z`)**:
  - One-click minimal mode: hides instrument panels, leaving only an ultra-clean floating telemetry pill and breathtaking views of the planet.
- **📸 Cinematic Photo Mode**:
  - Orbit freely around your human flyer in front of iconic world landmarks to capture wallpaper-worthy screenshots.
- **🎵 Generative Ambient Soundscape & Dynamic FX**:
  - Synthesized directly via Web Audio API:
  - Soothing D-major ambient musical pads drifting peacefully in the breeze.
  - Dynamic wind rush modulating organically with airspeed.
  - Sonic boom sub-bass impulse when crossing Mach 1.
  - Zero external MP3/WAV files to fail loading.
- **🌐 1:1 Real-World Earth Simulation**:
  - High-precision WGS84 geodesic coordinates powered by CesiumJS.
  - High-res global satellite imagery (ESRI World Imagery) and OpenStreetMap terrain.
  - Dynamic sun/moon lighting, atmospheric Rayleigh/Mie scattering, and golden hour / sunset time-of-day scrub controls (`T`).
  - Built-in support for Google Photorealistic 3D Tiles & Cesium Ion tokens in Settings (`⚙️`).
- **🗺️ Global Teleportation Landmarks (`L`)**:
  - Instant fly-to for New York City, Mount Everest, Paris (Eiffel Tower), Tokyo, Grand Canyon, Dubai (Burj Khalifa), Pyramids of Giza, Rio de Janeiro, London, Sydney, and Low Earth Orbit (120 km).

---

## 🎮 Flight Controls

| Key / Input | Action |
| :--- | :--- |
| **`W` / `S`** or **`↑` / `↓`** | **Dive & Swoop!** (Diving builds kinetic speed; pulling up swoops high into the sky) |
| **`A` / `D`** or **`←` / `→`** | **Acrobatic Banking** (Lean human body into aerodynamic turns) |
| **`Space`** | **Ascend Vertically** (Rocket up to the clouds, stratosphere, and space) |
| **`C`** or **`Ctrl`** | **Descend Vertically** (Dive towards Earth's surface) |
| **`Shift`** | **Hypersonic Boost Acceleration** |
| **`X`** | **Airbrake Deceleration** |
| **`Z`** | **Zen Mode** (Toggle ultra-clean scenic roaming view) |
| **`1` – `6`** | **Speed Presets**: Hover (`1`) to Mach 10 (`6`) |
| **`0`** or **`M`** | **MACH 20 GOD SPEED** (24,700 km/h around the globe) |
| **`V`** | **Switch Perspective**: 3rd-Person ⇋ 1st-Person Human Eyes ⇋ Free Orbit |
| **`Mouse Drag`** | **Fluid Steering** (Aim where you want to fly) |
| **`Mouse Wheel`** | **Throttle acceleration / deceleration** |
| **`T`** | **Time of Day** (Dawn, Midday, Golden Sunset, Starry Night) |
| **`L`** | **Global Landmarks Menu** (Warp to Everest, Paris, NYC, Dubai, Space) |
| **`H`** | **Toggle HUD** (Cinematic screenshot mode) |
| **`P`** | **Hover / Pause** in place |

---

## 🤝 Open Source Dream Project

This is an open-source community project. We welcome everyone to contribute ideas, code, art, and music!

Check out [**`CONTRIBUTING.md`**](CONTRIBUTING.md) to learn how to:
- Add new world destinations and scenic routes
- Add custom human avatars and 3D glTF/VRM models
- Add new ambient soundscapes and environmental audio
- Build multiplayer free-roaming

---

## 🚀 How to Run Locally

```bash
# Clone the repository
git clone https://github.com/kaushalboii/Earth-Roamer.git
cd Earth-Roamer

# Install dependencies
npm install

# Start local dev server
npm run dev
```

Visit [`http://localhost:3000`](http://localhost:3000) in your browser.

---

## 🌐 How to Deploy to GitHub Pages

1. Push your changes to GitHub:
   ```bash
   git push origin main
   ```
2. In your GitHub repository:
   - Go to **Settings** > **Pages**.
   - Under **Build and deployment** > **Source**, choose **GitHub Actions**.
3. GitHub Actions builds and publishes automatically to `https://<your-username>.github.io/Earth-Roamer/`!

---

## 📜 License

This project is open-source under the [MIT License](LICENSE).
