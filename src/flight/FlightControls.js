// Flight Controls: Keyboard, Mouse, and UI Input Handling

export class FlightControls {
  constructor(physics, cameraController, audioManager, onAction) {
    this.physics = physics;
    this.cameraController = cameraController;
    this.audioManager = audioManager;
    this.onAction = onAction;

    // Active control states
    this.pitchUp = false;
    this.pitchDown = false;
    this.rollLeft = false;
    this.rollRight = false;
    this.yawLeft = false;
    this.yawRight = false;
    this.ascend = false;
    this.descend = false;
    this.boost = false;
    this.brake = false;

    this.mouseDeltaX = 0;
    this.mouseDeltaY = 0;
    this.isDragging = false;
    this.lastMouseX = 0;
    this.lastMouseY = 0;

    this.initListeners();
  }

  initListeners() {
    window.addEventListener('keydown', (e) => this.handleKeyDown(e));
    window.addEventListener('keyup', (e) => this.handleKeyUp(e));

    // Mouse drag steering
    window.addEventListener('mousedown', (e) => {
      if (e.target.closest('button, input, select, .interactive-ui, .modal')) return;
      this.isDragging = true;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
      if (this.audioManager) this.audioManager.ensureContext();
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      const dx = e.clientX - this.lastMouseX;
      const dy = e.clientY - this.lastMouseY;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;

      if (this.cameraController && this.cameraController.viewMode === 'orbit') {
        this.cameraController.orbit(dx, dy);
      } else {
        this.mouseDeltaX += dx * 0.45;
        this.mouseDeltaY += dy * 0.45;
      }
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    // Mouse wheel for speed throttle
    window.addEventListener('wheel', (e) => {
      if (e.target.closest('.modal, .hud-panel-scrollable')) return;
      if (e.deltaY < 0) {
        this.physics.setTargetSpeed(this.physics.targetSpeed * 1.25 + 40);
      } else {
        this.physics.setTargetSpeed(Math.max(0, this.physics.targetSpeed * 0.8 - 40));
      }
    }, { passive: true });
  }

  handleKeyDown(e) {
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (this.audioManager) this.audioManager.ensureContext();

    switch (e.code) {
      // Pitch / Dive & Pull Up
      case 'KeyW':
      case 'ArrowUp':
        this.pitchDown = true;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.pitchUp = true;
        break;

      // Roll / Bank
      case 'KeyA':
      case 'ArrowLeft':
        this.rollLeft = true;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.rollRight = true;
        break;

      // Yaw / Rudder
      case 'KeyQ':
        this.yawLeft = true;
        break;
      case 'KeyE':
        this.yawRight = true;
        break;

      // Vertical Ascend / Descend
      case 'Space':
        e.preventDefault();
        this.ascend = true;
        break;
      case 'KeyC':
      case 'ControlLeft':
      case 'ControlRight':
        this.descend = true;
        break;

      // Boost & Brake
      case 'ShiftLeft':
      case 'ShiftRight':
        this.boost = true;
        break;
      case 'KeyX':
        this.brake = true;
        break;

      // Speed Presets
      case 'Digit1':
        this.physics.setTargetSpeed(30); // Hover
        break;
      case 'Digit2':
        this.physics.setTargetSpeed(250); // Gliding Cruise
        break;
      case 'Digit3':
        this.physics.setTargetSpeed(1235); // Mach 1.0 (Sonic Boom!)
        break;
      case 'Digit4':
      case 'Digit0':
      case 'KeyM':
        this.physics.setTargetSpeed(24700); // MACH 20 GOD SPEED!
        break;

      // Zen Mode
      case 'KeyZ':
        if (this.onAction) this.onAction('toggleZenMode');
        break;

      // Perspective switcher
      case 'KeyV':
        if (this.cameraController) {
          const newMode = this.cameraController.toggleViewMode();
          if (this.onAction) this.onAction('viewMode', newMode);
        }
        break;

      // Time of day toggle
      case 'KeyT':
        if (this.onAction) this.onAction('cycleTimeOfDay');
        break;

      // Toggle HUD
      case 'KeyH':
        if (this.onAction) this.onAction('toggleHUD');
        break;

      // Landmarks Menu
      case 'KeyL':
        if (this.onAction) this.onAction('openLandmarks');
        break;

      // Audio Mute
      case 'KeyU':
        if (this.audioManager) {
          const muted = this.audioManager.toggleMute();
          if (this.onAction) this.onAction('muteToggle', muted);
        }
        break;

      // Pause / Hover in place
      case 'KeyP':
        if (this.physics.speed > 5) {
          this.physics.setTargetSpeed(0);
        } else {
          this.physics.setTargetSpeed(300);
        }
        break;
    }
  }

  handleKeyUp(e) {
    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.pitchDown = false;
        break;
      case 'KeyS':
      case 'ArrowDown':
        this.pitchUp = false;
        break;
      case 'KeyA':
      case 'ArrowLeft':
        this.rollLeft = false;
        break;
      case 'KeyD':
      case 'ArrowRight':
        this.rollRight = false;
        break;
      case 'KeyQ':
        this.yawLeft = false;
        break;
      case 'KeyE':
        this.yawRight = false;
        break;
      case 'Space':
        this.ascend = false;
        break;
      case 'KeyC':
      case 'ControlLeft':
      case 'ControlRight':
        this.descend = false;
        break;
      case 'ShiftLeft':
      case 'ShiftRight':
        this.boost = false;
        break;
      case 'KeyX':
        this.brake = false;
        break;
    }
  }
}
