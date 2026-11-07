import { SPEED_PRESETS, ATMOSPHERE_LAYERS } from '../config.js';

export class HUD {
  constructor(container, options = {}) {
    this.container = container;
    this.options = options;
    this.isVisible = true;
    this.isZenMode = false;

    this.render();
    this.bindEvents();
  }

  render() {
    this.hudEl = document.createElement('div');
    this.hudEl.className = 'hud-container';
    this.hudEl.id = 'flightHud';

    this.hudEl.innerHTML = `
      <!-- TOP NAVIGATION & ZEN ROAMING BAR -->
      <div class="hud-topbar interactive-ui">
        <div class="hud-brand">
          <span class="hero-crest">🕸️</span>
          <div class="brand-text">
            <h1>EARTH ROAMER</h1>
            <span class="sub">HUMAN FREE-FLIGHT SIMULATOR</span>
          </div>
        </div>

        <!-- SPEED PRESET GEAR SELECTOR -->
        <div class="mach-selector">
          ${SPEED_PRESETS.map(p => `
            <button class="mach-btn" data-kmh="${p.kmh}" title="${p.desc} [Key ${p.key}]">
              <span class="key-badge">${p.key}</span>
              <span class="mach-label">${p.label}</span>
            </button>
          `).join('')}
        </div>

        <!-- QUICK UTILITY CONTROLS -->
        <div class="hud-actions">
          <button class="hud-icon-btn highlight-btn" id="zenModeBtn" title="Toggle Zen Mode [Z]">
            <span class="btn-icon">🌿</span>
            <span class="btn-label" id="zenLabel">Zen Mode</span>
          </button>
          <button class="hud-icon-btn" id="photoModeBtn" title="Photo Mode / Camera Orbit">
            <span class="btn-icon">📸</span>
            <span class="btn-label">Photo</span>
          </button>
          <button class="hud-icon-btn" id="viewModeBtn" title="Switch View Mode [V]">
            <span class="btn-icon">👁️</span>
            <span class="btn-label" id="viewModeLabel">3rd Person</span>
          </button>
          <button class="hud-icon-btn" id="timeCycleBtn" title="Toggle Time of Day [T]">
            <span class="btn-icon">🌅</span>
            <span class="btn-label">Time</span>
          </button>
          <button class="hud-icon-btn" id="landmarkBtn" title="Landmarks Menu [L]">
            <span class="btn-icon">🌍</span>
            <span class="btn-label">Destinations</span>
          </button>
          <button class="hud-icon-btn" id="zenMusicBtn" title="Ambient Music Toggle">
            <span class="btn-icon" id="zenMusicIcon">🎵</span>
          </button>
          <button class="hud-icon-btn" id="muteBtn" title="Mute Audio [U]">
            <span class="btn-icon" id="muteIcon">🔊</span>
          </button>
          <button class="hud-icon-btn" id="settingsBtn" title="Settings">
            <span class="btn-icon">⚙️</span>
          </button>
          <button class="hud-icon-btn" id="helpBtn" title="Controls & Help [H]">
            <span class="btn-icon">❓</span>
          </button>
        </div>
      </div>

      <!-- ZEN MINIMAL FLOATING BADGE (Visible in Zen Mode) -->
      <div class="zen-minimal-badge" id="zenBadge" style="display: none;">
        <span class="zen-speed" id="zenSpeedText">120 KM/H</span>
        <span class="zen-dot">•</span>
        <span class="zen-pose" id="zenPoseText">GLIDING</span>
        <span class="zen-dot">•</span>
        <span class="zen-alt" id="zenAltText">350 M</span>
      </div>

      <!-- BOTTOM INSTRUMENT CONSOLE -->
      <div class="hud-bottom" id="hudBottomSection">
        <!-- LEFT: TELEMETRY & HUMAN DYNAMICS -->
        <div class="instrument-card telemetry-card">
          <div class="mach-meter-wrapper">
            <div class="mach-label-top">HUMAN AIRSPEED</div>
            <div class="mach-big-display" id="hudMach">MACH 0.10</div>
            <div class="mach-bar-track">
              <div class="mach-bar-fill" id="hudMachBar"></div>
            </div>
          </div>

          <div class="telemetry-grid">
            <div class="telem-item">
              <span class="telem-label">KM/H</span>
              <span class="telem-val" id="hudKmh">120</span>
            </div>
            <div class="telem-item">
              <span class="telem-label">MPH</span>
              <span class="telem-val" id="hudMph">75</span>
            </div>
            <div class="telem-item">
              <span class="telem-label">FLIGHT STATE</span>
              <span class="telem-val highlight-state" id="hudPoseState">GLIDING</span>
            </div>
          </div>

          <div class="altitude-section">
            <div class="alt-header">
              <span class="telem-label">ALTITUDE</span>
              <span class="layer-badge" id="hudAtmosphereLayer">Troposphere</span>
            </div>
            <div class="alt-values">
              <div class="alt-primary" id="hudAltPrimary">350 m</div>
              <div class="alt-secondary" id="hudAltSecondary">1,148 ft</div>
            </div>
            <div class="vspeed-row">
              <span class="telem-label">CLIMB RATE:</span>
              <span class="vspeed-val" id="hudVspeed">0.0 m/s</span>
            </div>
          </div>
        </div>

        <!-- CENTER: COMPASS TAPE & ATTITUDE INDICATOR -->
        <div class="instrument-card navigation-card">
          <div class="compass-tape-wrapper">
            <div class="compass-tape-inner" id="hudCompassTape"></div>
            <div class="compass-marker-center"></div>
          </div>

          <div class="attitude-indicator">
            <div class="artificial-horizon" id="hudHorizon">
              <div class="sky-half"></div>
              <div class="ground-half"></div>
              <div class="horizon-line"></div>
              <div class="pitch-ladder" id="hudPitchLadder"></div>
            </div>
            <div class="aircraft-reticle">
              <div class="reticle-center"></div>
              <div class="reticle-wing left"></div>
              <div class="reticle-wing right"></div>
            </div>
          </div>

          <div class="heading-readout" id="hudHeadingDeg">045° NE</div>
        </div>

        <!-- RIGHT: MINI-MAP & GLOBAL COORDINATES -->
        <div class="instrument-card map-card">
          <div class="minimap-header">
            <span>EARTH EXPLORER</span>
            <span class="coords-latlon" id="hudCoords">40.748° N, 73.985° W</span>
          </div>
          <div class="minimap-container">
            <canvas id="miniMapCanvas" width="220" height="110"></canvas>
          </div>
          <div class="flight-status-row">
            <span class="status-indicator"></span>
            <span class="status-text" id="hudStatus">STRESS-FREE FREE ROAM</span>
          </div>
        </div>
      </div>

      <!-- KEYBINDINGS / HELP MODAL -->
      <div class="modal-backdrop help-modal-backdrop" id="helpModal" style="display: none;">
        <div class="modal-box help-modal-box">
          <div class="modal-header">
            <div class="modal-title">
              <span class="icon">🕸️</span>
              <h3>Stress-Free Human Flight Controls</h3>
            </div>
            <button class="modal-close-btn" id="closeHelpBtn">&times;</button>
          </div>
          <div class="modal-body">
            <div class="controls-grid">
              <div class="control-row highlight-row">
                <span class="key-combo">W / S or Up / Down</span>
                <span class="key-desc">Dive & Swoop! Diving builds kinetic speed, pulling up swoops high into the sky!</span>
              </div>
              <div class="control-row">
                <span class="key-combo">A / D or Left / Right</span>
                <span class="key-desc">Acrobatic Banking (Lean human body into aerodynamic turns)</span>
              </div>
              <div class="control-row">
                <span class="key-combo">Space</span>
                <span class="key-desc">Ascend Vertically (Rocket up to clouds, stratosphere, and space)</span>
              </div>
              <div class="control-row">
                <span class="key-combo">C / Left Ctrl</span>
                <span class="key-desc">Descend Vertically (Dive towards Earth's surface)</span>
              </div>
              <div class="control-row">
                <span class="key-combo">Shift</span>
                <span class="key-desc">Superhuman Boost Acceleration</span>
              </div>
              <div class="control-row">
                <span class="key-combo">Z</span>
                <span class="key-desc">Zen Mode (Hide clutter, enjoy pure breathtaking Earth roaming)</span>
              </div>
              <div class="control-row highlight-row">
                <span class="key-combo">0 or M</span>
                <span class="key-desc">MACH 20 GOD SPEED (24,700 km/h around the globe)</span>
              </div>
              <div class="control-row">
                <span class="key-combo">V</span>
                <span class="key-desc">Toggle View: 3rd-Person ⇋ 1st-Person Human Eyes ⇋ Free Orbit</span>
              </div>
              <div class="control-row">
                <span class="key-combo">Mouse Drag</span>
                <span class="key-desc">Effortless fluid steering (Aim where you want to fly)</span>
              </div>
              <div class="control-row">
                <span class="key-combo">T</span>
                <span class="key-desc">Time of Day (Dawn, Midday, Golden Sunset, Starry Night)</span>
              </div>
              <div class="control-row">
                <span class="key-combo">L</span>
                <span class="key-desc">Global Landmarks Menu (Warp to Everest, Paris, NYC, Dubai, Space)</span>
              </div>
              <div class="control-row">
                <span class="key-combo">P</span>
                <span class="key-desc">Peaceful Floating Hover in place</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    this.container.appendChild(this.hudEl);
    this.initCompassTape();
  }

  initCompassTape() {
    const tape = this.hudEl.querySelector('#hudCompassTape');
    let html = '';
    for (let deg = -180; deg <= 540; deg += 15) {
      const normalized = ((deg % 360) + 360) % 360;
      let label = normalized.toString();
      if (normalized === 0) label = 'N';
      else if (normalized === 45) label = 'NE';
      else if (normalized === 90) label = 'E';
      else if (normalized === 135) label = 'SE';
      else if (normalized === 180) label = 'S';
      else if (normalized === 225) label = 'SW';
      else if (normalized === 270) label = 'W';
      else if (normalized === 315) label = 'NW';

      const isMajor = deg % 45 === 0;
      html += `
        <div class="compass-tick ${isMajor ? 'major' : ''}">
          <span class="tick-label">${label}</span>
          <div class="tick-line"></div>
        </div>
      `;
    }
    tape.innerHTML = html;
  }

  bindEvents() {
    // Speed buttons
    const btns = this.hudEl.querySelectorAll('.mach-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        const kmh = parseFloat(btn.getAttribute('data-kmh'));
        if (this.options.onSpeedSelect) this.options.onSpeedSelect(kmh);
      });
    });

    // Zen Mode button
    const zenBtn = this.hudEl.querySelector('#zenModeBtn');
    zenBtn.addEventListener('click', () => this.toggleZenMode());

    // Photo Mode button
    const photoBtn = this.hudEl.querySelector('#photoModeBtn');
    photoBtn.addEventListener('click', () => {
      if (this.options.onPhotoMode) this.options.onPhotoMode();
    });

    // View mode button
    const viewBtn = this.hudEl.querySelector('#viewModeBtn');
    viewBtn.addEventListener('click', () => {
      if (this.options.onToggleView) this.options.onToggleView();
    });

    // Time cycle button
    const timeBtn = this.hudEl.querySelector('#timeCycleBtn');
    timeBtn.addEventListener('click', () => {
      if (this.options.onCycleTime) this.options.onCycleTime();
    });

    // Landmarks button
    const lmBtn = this.hudEl.querySelector('#landmarkBtn');
    lmBtn.addEventListener('click', () => {
      if (this.options.onOpenLandmarks) this.options.onOpenLandmarks();
    });

    // Zen ambient music button
    const zenMusicBtn = this.hudEl.querySelector('#zenMusicBtn');
    zenMusicBtn.addEventListener('click', () => {
      if (this.options.onToggleZenMusic) {
        const active = this.options.onToggleZenMusic();
        zenMusicBtn.querySelector('#zenMusicIcon').textContent = active ? '🎵' : '🔇';
      }
    });

    // Mute button
    const muteBtn = this.hudEl.querySelector('#muteBtn');
    muteBtn.addEventListener('click', () => {
      if (this.options.onToggleMute) this.options.onToggleMute();
    });

    // Settings button
    const settingsBtn = this.hudEl.querySelector('#settingsBtn');
    settingsBtn.addEventListener('click', () => {
      if (this.options.onOpenSettings) this.options.onOpenSettings();
    });

    // Help button
    const helpBtn = this.hudEl.querySelector('#helpBtn');
    const helpModal = this.hudEl.querySelector('#helpModal');
    const closeHelp = this.hudEl.querySelector('#closeHelpBtn');

    helpBtn.addEventListener('click', () => {
      helpModal.style.display = 'flex';
    });
    closeHelp.addEventListener('click', () => {
      helpModal.style.display = 'none';
    });
    helpModal.addEventListener('click', (e) => {
      if (e.target === helpModal) helpModal.style.display = 'none';
    });
  }

  toggleZenMode() {
    this.isZenMode = !this.isZenMode;
    const bottom = this.hudEl.querySelector('#hudBottomSection');
    const badge = this.hudEl.querySelector('#zenBadge');
    const zenBtn = this.hudEl.querySelector('#zenModeBtn');

    if (this.isZenMode) {
      bottom.style.display = 'none';
      badge.style.display = 'flex';
      zenBtn.classList.add('active');
    } else {
      bottom.style.display = 'flex';
      badge.style.display = 'none';
      zenBtn.classList.remove('active');
    }
  }

  update(physics, viewMode) {
    // 1. Update Mach & Speed
    const machEl = this.hudEl.querySelector('#hudMach');
    const machBar = this.hudEl.querySelector('#hudMachBar');
    const machVal = physics.currentMach.toFixed(2);
    machEl.textContent = `MACH ${machVal}`;

    const machRatio = Math.min(1.0, physics.currentMach / 20.0);
    machBar.style.width = `${machRatio * 100}%`;

    if (physics.currentMach >= 10.0) {
      machEl.className = 'mach-big-display mach-godspeed';
      machBar.className = 'mach-bar-fill mach-godspeed-bar';
    } else if (physics.currentMach >= 5.0) {
      machEl.className = 'mach-big-display mach-hypersonic';
      machBar.className = 'mach-bar-fill mach-hypersonic-bar';
    } else if (physics.currentMach >= 1.0) {
      machEl.className = 'mach-big-display mach-supersonic';
      machBar.className = 'mach-bar-fill mach-supersonic-bar';
    } else {
      machEl.className = 'mach-big-display';
      machBar.className = 'mach-bar-fill';
    }

    const kmh = Math.round(physics.speed);
    const mph = Math.round(physics.speed * 0.621371);
    this.hudEl.querySelector('#hudKmh').textContent = kmh.toLocaleString();
    this.hudEl.querySelector('#hudMph').textContent = mph.toLocaleString();

    // Human flight posture
    const poseState = this.hudEl.querySelector('#hudPoseState');
    poseState.textContent = physics.pose.toUpperCase();

    // Altitude
    const altM = Math.round(physics.alt);
    const altFt = Math.round(physics.alt * 3.28084);
    if (altM >= 10000) {
      this.hudEl.querySelector('#hudAltPrimary').textContent = `${(altM / 1000).toFixed(1)} km`;
    } else {
      this.hudEl.querySelector('#hudAltPrimary').textContent = `${altM.toLocaleString()} m`;
    }
    this.hudEl.querySelector('#hudAltSecondary').textContent = `${altFt.toLocaleString()} ft`;

    // Atmospheric layer
    let currentLayer = ATMOSPHERE_LAYERS[0];
    for (const layer of ATMOSPHERE_LAYERS) {
      if (physics.alt <= layer.maxAlt) {
        currentLayer = layer;
        break;
      }
    }
    const layerBadge = this.hudEl.querySelector('#hudAtmosphereLayer');
    layerBadge.textContent = currentLayer.name;
    layerBadge.style.color = currentLayer.color;
    layerBadge.style.borderColor = currentLayer.color;

    // Vertical climb/dive rate
    const vspeed = physics.verticalSpeed.toFixed(1);
    const vspeedEl = this.hudEl.querySelector('#hudVspeed');
    vspeedEl.textContent = `${vspeed > 0 ? '+' : ''}${vspeed} m/s`;
    vspeedEl.style.color = vspeed > 0 ? '#4ade80' : vspeed < 0 ? '#f87171' : '#94a3b8';

    // Compass
    const heading = Math.round(physics.heading);
    const compassInner = this.hudEl.querySelector('#hudCompassTape');
    const pxPerDegree = 3.33;
    compassInner.style.transform = `translateX(${-(heading * pxPerDegree)}px)`;

    const headingCardinals = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const cardIdx = Math.round(heading / 45) % 8;
    this.hudEl.querySelector('#hudHeadingDeg').textContent = `${heading.toString().padStart(3, '0')}° ${headingCardinals[cardIdx]}`;

    // Horizon
    const horizon = this.hudEl.querySelector('#hudHorizon');
    const pitchPx = -physics.pitch * 2.5;
    horizon.style.transform = `translateY(${pitchPx}px) rotate(${-physics.roll}deg)`;

    // Coordinates
    const latStr = `${Math.abs(physics.lat).toFixed(3)}° ${physics.lat >= 0 ? 'N' : 'S'}`;
    const lonStr = `${Math.abs(physics.lon).toFixed(3)}° ${physics.lon >= 0 ? 'E' : 'W'}`;
    this.hudEl.querySelector('#hudCoords').textContent = `${latStr}, ${lonStr}`;

    // Zen badge update
    if (this.isZenMode) {
      this.hudEl.querySelector('#zenSpeedText').textContent = `${kmh.toLocaleString()} KM/H`;
      this.hudEl.querySelector('#zenPoseText').textContent = physics.pose.toUpperCase();
      this.hudEl.querySelector('#zenAltText').textContent = `${altM.toLocaleString()} M`;
    }

    // View Mode label
    const viewLabel = this.hudEl.querySelector('#viewModeLabel');
    if (viewMode === 'thirdPerson') viewLabel.textContent = '3rd Person';
    else if (viewMode === 'firstPerson') viewLabel.textContent = '1st Person';
    else viewLabel.textContent = 'Free Orbit';

    // Highlight active preset button
    const btns = this.hudEl.querySelectorAll('.mach-btn');
    btns.forEach(btn => {
      const bKmh = parseFloat(btn.getAttribute('data-kmh'));
      if (Math.abs(physics.targetSpeed - bKmh) < 100) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  setMuteState(isMuted) {
    const icon = this.hudEl.querySelector('#muteIcon');
    icon.textContent = isMuted ? '🔇' : '🔊';
  }

  toggleVisibility() {
    this.isVisible = !this.isVisible;
    this.hudEl.style.display = this.isVisible ? 'flex' : 'none';
    return this.isVisible;
  }
}
