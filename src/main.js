import 'cesium/Build/Cesium/Widgets/widgets.css';
import './style.css';

import { GlobeManager } from './globe/GlobeManager.js';
import { FlightPhysics } from './flight/FlightPhysics.js';
import { CameraController } from './flight/CameraController.js';
import { FlightControls } from './flight/FlightControls.js';
import { TouchControls } from './flight/TouchControls.js';
import { AudioManager } from './audio/AudioManager.js';
import { SpeedLinesOverlay } from './vfx/SpeedLinesOverlay.js';
import { SonicBoomVFX } from './vfx/SonicBoomVFX.js';
import { HUD } from './ui/HUD.js';
import { MiniMap } from './ui/MiniMap.js';
import { LandmarkModal } from './ui/LandmarkModal.js';
import { SettingsModal } from './ui/SettingsModal.js';
import { ScenicToursManager } from './tours/ScenicTours.js';

class SuperhumanApp {
  constructor() {
    this.lastTime = performance.now();
    this.timeOfDayHours = 17.5; // Beautiful Golden Sunset default
    this.prevMach = 0.10;

    this.init();
  }

  async init() {
    // 1. Initialize Cesium Globe
    this.globe = new GlobeManager('cesiumContainer');

    // 2. Flight Dynamics & Camera
    this.physics = new FlightPhysics();
    this.cameraController = new CameraController(this.globe.viewer);

    // 3. Audio Synthesizer (with Zen ambient soundtrack)
    this.audio = new AudioManager();

    // 4. VFX Canvas Overlay
    const vfxCanvas = document.getElementById('vfxCanvas');
    this.speedLines = new SpeedLinesOverlay(vfxCanvas);
    this.sonicBoom = new SonicBoomVFX(vfxCanvas);

    // 5. Scenic Tours Manager (Aerial glowing rings)
    this.scenicTours = new ScenicToursManager(this.globe.viewer, this.audio);

    // 6. UI & Modals
    const appContainer = document.getElementById('app');

    this.landmarkModal = new LandmarkModal(appContainer, {
      onSelect: (lm) => {
        this.physics.teleport(lm.lon, lm.lat, lm.alt, lm.heading, lm.pitch);
      },
      onStartTour: (tourId) => {
        this.scenicTours.startTour(tourId);
      }
    });

    this.settingsModal = new SettingsModal(appContainer, {
      onVolumeChange: (vol) => this.audio.setVolume(vol),
      onImageryChange: (type) => this.globe.setImageryProvider(type),
      onSuitThemeChange: (theme) => this.globe.setSuitTheme(theme)
    });

    // 7. Master HUD
    this.hud = new HUD(appContainer, {
      onSpeedSelect: (kmh) => this.physics.setTargetSpeed(kmh),
      onToggleView: () => {
        const mode = this.cameraController.toggleViewMode();
        this.hud.update(this.physics, mode);
      },
      onCycleTime: () => this.cycleTimeOfDay(),
      onOpenLandmarks: () => this.landmarkModal.open(),
      onOpenSettings: () => this.settingsModal.open(),
      onToggleZenMusic: () => this.audio.toggleZenMusic(),
      onPhotoMode: () => {
        this.cameraController.setViewMode('orbit');
        this.hud.toggleZenMode();
      },
      onToggleMute: () => {
        const isMuted = this.audio.toggleMute();
        this.hud.setMuteState(isMuted);
      }
    });

    // 8. MiniMap
    const miniMapCanvas = document.getElementById('miniMapCanvas');
    this.miniMap = new MiniMap(miniMapCanvas);

    // 9. Flight Input Controls & Touch Support
    this.controls = new FlightControls(
      this.physics,
      this.cameraController,
      this.audio,
      (action, val) => this.handleAction(action, val)
    );

    new TouchControls(this.controls, this.hud);

    // Initial time of day setup
    this.globe.setTimeOfDay(this.timeOfDayHours);

    // Check if Google 3D Tiles key was stored
    const savedGoogleKey = localStorage.getItem('google_3d_tiles_key');
    if (savedGoogleKey) {
      this.globe.loadGoogle3DTiles(savedGoogleKey).catch(() => {});
    }

    // Start Simulation Loop
    this.startLoop();
  }

  handleAction(action, val) {
    if (action === 'viewMode') {
      this.hud.update(this.physics, val);
    } else if (action === 'toggleZenMode') {
      this.hud.toggleZenMode();
    } else if (action === 'cycleTimeOfDay') {
      this.cycleTimeOfDay();
    } else if (action === 'toggleHUD') {
      this.hud.toggleVisibility();
    } else if (action === 'openLandmarks') {
      this.landmarkModal.toggle();
    } else if (action === 'muteToggle') {
      this.hud.setMuteState(val);
    }
  }

  cycleTimeOfDay() {
    const times = [6.0, 12.0, 17.5, 23.0];
    let nextIdx = 0;
    for (let i = 0; i < times.length; i++) {
      if (this.timeOfDayHours < times[i] - 0.5) {
        nextIdx = i;
        break;
      }
    }
    this.timeOfDayHours = times[nextIdx];
    this.globe.setTimeOfDay(this.timeOfDayHours);
  }

  startLoop() {
    const loop = (currentTime) => {
      const dt = Math.min(0.1, (currentTime - this.lastTime) / 1000);
      this.lastTime = currentTime;

      // 1. Update Physics Dynamics
      this.physics.update(dt, this.controls);

      // 2. Update Human 3D Model position & orientation on Globe
      this.globe.updateHero(this.physics, this.cameraController.viewMode);

      // 3. Update Camera Position & Orientation
      this.cameraController.update(this.physics, dt);

      // 4. Update Scenic Tours (check if passing through glowing rings)
      this.scenicTours.update(this.physics);

      // 5. Check for Sonic Boom event (crossing Mach 1.0)
      if (this.prevMach < 1.0 && this.physics.currentMach >= 1.0) {
        this.sonicBoom.trigger();
      }
      this.prevMach = this.physics.currentMach;

      // 6. Update Audio Synthesis
      this.audio.update(this.physics.speed, this.physics.currentMach, this.physics.alt);

      // 7. Update Visual Effects (Warp Speed Lines & Shockwaves)
      this.speedLines.update(dt, this.physics.speed, this.physics.maxSpeed);
      this.sonicBoom.update(dt);

      // 8. Update HUD Telemetry & Instruments
      this.hud.update(this.physics, this.cameraController.viewMode);

      // 9. Update Global MiniMap
      this.miniMap.update(this.physics.lon, this.physics.lat, this.physics.heading);

      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new SuperhumanApp();
});
