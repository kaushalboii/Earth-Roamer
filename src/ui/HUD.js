import { SPEED_PRESETS } from '../config.js';

export class HUD {
  constructor(container, options = {}) {
    this.container = container;
    this.options = options;
    this.isMuted = false;

    this.render();
    this.bindEvents();
  }

  render() {
    this.hudEl = document.createElement('div');
    this.hudEl.className = 'hud-simple-container';
    this.hudEl.id = 'flightHud';

    this.hudEl.innerHTML = `
      <!-- TOP BAR: SPEED TELEMETRY & GEARS + UTILITY -->
      <div class="hud-top-row">
        <!-- 1. MAIN SPEED CAPSULE -->
        <div class="speed-capsule interactive-ui">
          <div class="speed-main-display">
            <span class="speed-val" id="hudKmh">120</span>
            <span class="speed-unit">KM/H</span>
            <span class="mach-badge" id="hudMach">MACH 0.10</span>
          </div>

          <div class="speed-sub-row">
            <span class="hud-stat" id="hudAlt">ALT: 45 M</span>
            <span class="hud-stat-dot">•</span>
            <span class="hud-stat" id="hudState">GLIDING</span>
            <span class="hud-stat-dot">•</span>
            <span class="hud-stat" id="hudLocation">MANHATTAN</span>
          </div>

          <div class="speed-gauge-track">
            <div class="speed-gauge-fill" id="hudSpeedBar"></div>
          </div>

          <!-- QUICK SPEED PRESETS (4 Simple Gears) -->
          <div class="speed-gears-row">
            <button class="gear-btn active" data-kmh="30" title="Key [1]">1 • HOVER</button>
            <button class="gear-btn" data-kmh="250" title="Key [2]">2 • CRUISE</button>
            <button class="gear-btn" data-kmh="1235" title="Key [3]">3 • MACH 1</button>
            <button class="gear-btn gear-mach20" data-kmh="24700" title="Key [4]">4 • MACH 20</button>
          </div>
        </div>

        <!-- 2. QUICK UTILITY BUTTONS -->
        <div class="quick-utilities interactive-ui">
          <button class="util-btn" id="viewModeBtn" title="Switch 3rd / 1st Person [V]">
            <span class="btn-icon">👁️</span>
            <span id="viewModeLabel">3rd Person</span>
          </button>
          <button class="util-btn" id="timeCycleBtn" title="Cycle Time of Day [T]">
            <span class="btn-icon">🌅</span>
            <span>Time</span>
          </button>
          <button class="util-btn" id="muteBtn" title="Mute Audio [U]">
            <span class="btn-icon" id="muteIcon">🔊</span>
          </button>
          <button class="util-btn" id="settingsBtn" title="Settings">
            <span class="btn-icon">⚙️</span>
          </button>
        </div>
      </div>

      <!-- BOTTOM-LEFT: SIMPLE FLIGHT MOVES CARD -->
      <div class="moves-card interactive-ui" id="movesCard">
        <div class="moves-card-header">
          <span class="moves-title">⚡ FLIGHT MOVES</span>
          <button class="moves-toggle-btn" id="toggleMovesBtn" title="Minimize Controls">▾</button>
        </div>
        <div class="moves-list" id="movesList">
          <div class="move-item">
            <span class="move-keys">A / D</span>
            <span class="move-action">Turn Left & Right</span>
          </div>
          <div class="move-item">
            <span class="move-keys">W / S</span>
            <span class="move-action">Dive & Climb Pitch</span>
          </div>
          <div class="move-item">
            <span class="move-keys">SPACE / C</span>
            <span class="move-action">Fly Up / Down (Street Level)</span>
          </div>
          <div class="move-item">
            <span class="move-keys">SHIFT / X</span>
            <span class="move-action">Hypersonic Boost / Brake</span>
          </div>
          <div class="move-item">
            <span class="move-keys">1, 2, 3, 4</span>
            <span class="move-action">Speed Gears (Hover to Mach 20)</span>
          </div>
          <div class="move-item">
            <span class="move-keys">V</span>
            <span class="move-action">Toggle 3rd / 1st Person</span>
          </div>
        </div>
      </div>
    `;

    this.container.appendChild(this.hudEl);
  }

  bindEvents() {
    // Quick Speed Gear Buttons
    const gearBtns = this.hudEl.querySelectorAll('.gear-btn');
    gearBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        gearBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const kmh = parseFloat(btn.getAttribute('data-kmh'));
        if (this.options.onSpeedSelect) this.options.onSpeedSelect(kmh);
      });
    });

    // View Mode Button
    const viewBtn = this.hudEl.querySelector('#viewModeBtn');
    viewBtn.addEventListener('click', () => {
      if (this.options.onToggleView) this.options.onToggleView();
    });

    // Time Cycle Button
    const timeBtn = this.hudEl.querySelector('#timeCycleBtn');
    timeBtn.addEventListener('click', () => {
      if (this.options.onCycleTime) this.options.onCycleTime();
    });

    // Mute Button
    const muteBtn = this.hudEl.querySelector('#muteBtn');
    muteBtn.addEventListener('click', () => {
      if (this.options.onToggleMute) this.options.onToggleMute();
    });

    // Settings Button
    const settingsBtn = this.hudEl.querySelector('#settingsBtn');
    settingsBtn.addEventListener('click', () => {
      if (this.options.onOpenSettings) this.options.onOpenSettings();
    });

    // Moves Card Minimize / Expand
    const toggleMoves = this.hudEl.querySelector('#toggleMovesBtn');
    const movesList = this.hudEl.querySelector('#movesList');
    toggleMoves.addEventListener('click', () => {
      if (movesList.style.display === 'none') {
        movesList.style.display = 'flex';
        toggleMoves.textContent = '▾';
      } else {
        movesList.style.display = 'none';
        toggleMoves.textContent = '▸';
      }
    });
  }

  setMuteState(isMuted) {
    this.isMuted = isMuted;
    const icon = this.hudEl.querySelector('#muteIcon');
    if (icon) icon.textContent = isMuted ? '🔇' : '🔊';
  }

  toggleZenMode() {
    const movesCard = this.hudEl.querySelector('#movesCard');
    if (movesCard) {
      movesCard.style.display = movesCard.style.display === 'none' ? 'block' : 'none';
    }
  }

  update(physics, viewMode) {
    // Speed display
    const kmh = Math.round(physics.speed);
    const kmhEl = this.hudEl.querySelector('#hudKmh');
    if (kmhEl) kmhEl.textContent = kmh.toLocaleString();

    // Mach display
    const machEl = this.hudEl.querySelector('#hudMach');
    if (machEl) {
      machEl.textContent = `MACH ${physics.currentMach.toFixed(2)}`;
      if (physics.currentMach >= 10.0) {
        machEl.className = 'mach-badge mach-plasma';
      } else if (physics.currentMach >= 1.0) {
        machEl.className = 'mach-badge mach-supersonic';
      } else {
        machEl.className = 'mach-badge';
      }
    }

    // Altitude display
    const altEl = this.hudEl.querySelector('#hudAlt');
    if (altEl) {
      const altM = Math.round(physics.alt);
      if (altM < 100) {
        altEl.textContent = `STREET ALT: ${altM} M`;
      } else if (altM < 10000) {
        altEl.textContent = `ALT: ${altM} M`;
      } else {
        altEl.textContent = `ORBIT: ${(altM / 1000).toFixed(1)} KM`;
      }
    }

    // Pose / Flight state
    const stateEl = this.hudEl.querySelector('#hudState');
    if (stateEl) {
      stateEl.textContent = physics.pose.toUpperCase();
    }

    // Speed gauge fill
    const speedBar = this.hudEl.querySelector('#hudSpeedBar');
    if (speedBar) {
      const ratio = Math.min(1.0, physics.speed / 24700.0);
      speedBar.style.width = `${Math.max(2, ratio * 100)}%`;
      if (physics.speed > 5000) {
        speedBar.style.background = 'linear-gradient(90deg, #0284c7, #f59e0b, #ef4444)';
      } else if (physics.speed > 1200) {
        speedBar.style.background = 'linear-gradient(90deg, #0284c7, #38bdf8)';
      } else {
        speedBar.style.background = '#38bdf8';
      }
    }

    // View Mode Label
    const viewLabel = this.hudEl.querySelector('#viewModeLabel');
    if (viewLabel && viewMode) {
      viewLabel.textContent = viewMode === 'firstPerson' ? '1st Person' : '3rd Person';
    }
  }

  updateMiniMap() {
    // Optional placeholder for compatibility
  }
}
