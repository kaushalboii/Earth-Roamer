// Touch Controls for Mobile Devices, Tablets, and iPads

export class TouchControls {
  constructor(controls, hud) {
    this.controls = controls;
    this.hud = hud;
    this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

    if (this.isTouchDevice) {
      this.render();
      this.bindTouchEvents();
    }
  }

  render() {
    this.container = document.createElement('div');
    this.container.className = 'touch-controls-container interactive-ui';
    this.container.id = 'touchControls';

    this.container.innerHTML = `
      <!-- LEFT VIRTUAL FLIGHT JOYSTICK -->
      <div class="virtual-joystick-zone" id="joystickZone">
        <div class="joystick-base" id="joystickBase">
          <div class="joystick-thumb" id="joystickThumb"></div>
        </div>
      </div>

      <!-- RIGHT ACTION BUTTONS -->
      <div class="touch-actions-zone">
        <button class="touch-btn touch-btn-boost" id="touchBoostBtn">
          <span>⚡</span>
          <small>BOOST</small>
        </button>
        <div class="touch-v-group">
          <button class="touch-btn touch-btn-up" id="touchAscendBtn">
            <span>▲</span>
            <small>CLIMB</small>
          </button>
          <button class="touch-btn touch-btn-down" id="touchDescendBtn">
            <span>▼</span>
            <small>DIVE</small>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(this.container);
  }

  bindTouchEvents() {
    const zone = this.container.querySelector('#joystickZone');
    const thumb = this.container.querySelector('#joystickThumb');
    let touchId = null;
    let startX = 0, startY = 0;
    const maxDist = 48; // max drag radius in pixels

    zone.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.changedTouches[0];
      touchId = touch.identifier;
      const rect = zone.getBoundingClientRect();
      startX = rect.left + rect.width / 2;
      startY = rect.top + rect.height / 2;
      if (this.controls.audioManager) this.controls.audioManager.ensureContext();
    }, { passive: false });

    zone.addEventListener('touchmove', (e) => {
      e.preventDefault();
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === touchId) {
          const dx = touch.clientX - startX;
          const dy = touch.clientY - startY;
          const dist = Math.hypot(dx, dy);
          const angle = Math.atan2(dy, dx);

          const clampedDist = Math.min(maxDist, dist);
          const thumbX = Math.cos(angle) * clampedDist;
          const thumbY = Math.sin(angle) * clampedDist;

          thumb.style.transform = `translate(${thumbX}px, ${thumbY}px)`;

          // Feed into steering delta
          this.controls.mouseDeltaX = (thumbX / maxDist) * 3.5;
          this.controls.mouseDeltaY = (thumbY / maxDist) * 2.8;
        }
      }
    }, { passive: false });

    const resetJoystick = (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchId) {
          touchId = null;
          thumb.style.transform = 'translate(0px, 0px)';
          this.controls.mouseDeltaX = 0;
          this.controls.mouseDeltaY = 0;
        }
      }
    };

    zone.addEventListener('touchend', resetJoystick);
    zone.addEventListener('touchcancel', resetJoystick);

    // Touch Action Buttons
    const boostBtn = this.container.querySelector('#touchBoostBtn');
    boostBtn.addEventListener('touchstart', (e) => { e.preventDefault(); this.controls.boost = true; }, { passive: false });
    boostBtn.addEventListener('touchend', () => { this.controls.boost = false; });
    boostBtn.addEventListener('touchcancel', () => { this.controls.boost = false; });

    const ascendBtn = this.container.querySelector('#touchAscendBtn');
    ascendBtn.addEventListener('touchstart', (e) => { e.preventDefault(); this.controls.ascend = true; }, { passive: false });
    ascendBtn.addEventListener('touchend', () => { this.controls.ascend = false; });
    ascendBtn.addEventListener('touchcancel', () => { this.controls.ascend = false; });

    const descendBtn = this.container.querySelector('#touchDescendBtn');
    descendBtn.addEventListener('touchstart', (e) => { e.preventDefault(); this.controls.descend = true; }, { passive: false });
    descendBtn.addEventListener('touchend', () => { this.controls.descend = false; });
    descendBtn.addEventListener('touchcancel', () => { this.controls.descend = false; });
  }
}

