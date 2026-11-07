import * as Cesium from 'cesium';

export class CameraController {
  constructor(viewer) {
    this.viewer = viewer;
    this.viewMode = 'thirdPerson'; // 'thirdPerson', 'firstPerson', 'orbit'

    // Orbit parameters
    this.orbitYaw = 0;
    this.orbitPitch = 15;
    this.orbitDistance = 8;

    // Smooth lerping positions
    this.currentFov = 60;
    this.cameraLagPos = null;

    // Disable Cesium's default mouse controls during flight so our custom flight controller has full authority
    this.disableDefaultControls();
  }

  disableDefaultControls() {
    const scene = this.viewer.scene;
    scene.screenSpaceCameraController.enableRotate = false;
    scene.screenSpaceCameraController.enableTranslate = false;
    scene.screenSpaceCameraController.enableZoom = false;
    scene.screenSpaceCameraController.enableTilt = false;
    scene.screenSpaceCameraController.enableLook = false;
  }

  toggleViewMode() {
    if (this.viewMode === 'thirdPerson') {
      this.viewMode = 'firstPerson';
    } else if (this.viewMode === 'firstPerson') {
      this.viewMode = 'orbit';
    } else {
      this.viewMode = 'thirdPerson';
    }
    return this.viewMode;
  }

  setViewMode(mode) {
    this.viewMode = mode;
  }

  orbit(dx, dy) {
    this.orbitYaw += dx * 0.4;
    this.orbitPitch = Math.max(-75, Math.min(85, this.orbitPitch + dy * 0.3));
  }

  update(physics, dt) {
    const scene = this.viewer.scene;
    const camera = this.viewer.camera;

    // 1. Get Hero's Cartesian3 position on Earth
    const heroCartographic = Cesium.Cartographic.fromDegrees(physics.lon, physics.lat, physics.alt);
    const heroCartesian = Cesium.Cartesian3.fromRadians(
      heroCartographic.longitude,
      heroCartographic.latitude,
      heroCartographic.height
    );

    // 2. Compute Local East-North-Up Frame Matrix
    const enuTransform = Cesium.Transforms.eastNorthUpToFixedFrame(heroCartesian);

    // 3. Dynamic FOV based on Mach speed (60° normal to 100° at Mach 20)
    const speedRatio = Math.min(1.0, physics.speed / physics.maxSpeed);
    const targetFov = 60 + speedRatio * 38; // 60 -> 98 degrees
    this.currentFov += (targetFov - this.currentFov) * Math.min(1.0, 5.0 * dt);
    camera.frustum.fov = Cesium.Math.toRadians(this.currentFov);

    // 4. Calculate Camera Offset in Local Coordinates
    const headingRad = Cesium.Math.toRadians(physics.heading);
    const pitchRad = Cesium.Math.toRadians(physics.pitch);
    const rollRad = Cesium.Math.toRadians(physics.roll);

    let localCameraOffset;

    if (this.viewMode === 'thirdPerson') {
      // Dynamic camera distance scaling with speed
      const baseDist = 5.5 + speedRatio * 9.5; // 5.5m at hover, 15m at Mach 20
      const baseHeight = 1.4 + speedRatio * 1.8;

      // Position behind the hero's flight heading & pitch
      // In local ENU:
      // Forward vector is (sin(heading)*cos(pitch), cos(heading)*cos(pitch), sin(pitch))
      const fwdX = Math.sin(headingRad) * Math.cos(pitchRad);
      const fwdY = Math.cos(headingRad) * Math.cos(pitchRad);
      const fwdZ = Math.sin(pitchRad);

      // Camera sits behind (-fwd) and slightly up (+Z)
      const camX = -fwdX * baseDist;
      const camY = -fwdY * baseDist;
      const camZ = -fwdZ * baseDist + baseHeight;

      localCameraOffset = new Cesium.Cartesian3(camX, camY, camZ);

    } else if (this.viewMode === 'firstPerson') {
      // First person: at hero's eye level looking ahead
      const eyeHeight = 0.4;
      const fwdEye = 0.5;

      const fwdX = Math.sin(headingRad) * Math.cos(pitchRad);
      const fwdY = Math.cos(headingRad) * Math.cos(pitchRad);
      const fwdZ = Math.sin(pitchRad);

      const camX = fwdX * fwdEye;
      const camY = fwdY * fwdEye;
      const camZ = fwdZ * fwdEye + eyeHeight;

      localCameraOffset = new Cesium.Cartesian3(camX, camY, camZ);

    } else { // Orbit Mode
      const orbitYawRad = Cesium.Math.toRadians(physics.heading + this.orbitYaw + 180);
      const orbitPitchRad = Cesium.Math.toRadians(this.orbitPitch);

      const dist = this.orbitDistance;
      const camX = Math.sin(orbitYawRad) * Math.cos(orbitPitchRad) * dist;
      const camY = Math.cos(orbitYawRad) * Math.cos(orbitPitchRad) * dist;
      const camZ = Math.sin(orbitPitchRad) * dist + 1.2;

      localCameraOffset = new Cesium.Cartesian3(camX, camY, camZ);
    }

    // Transform local camera offset to World Cartesian coordinates
    const targetCameraPos = Cesium.Matrix4.multiplyByPoint(
      enuTransform,
      localCameraOffset,
      new Cesium.Cartesian3()
    );

    // Smooth camera lag for organic sensation of flight weight
    if (!this.cameraLagPos || this.viewMode === 'firstPerson') {
      this.cameraLagPos = Cesium.Cartesian3.clone(targetCameraPos);
    } else {
      const lerpSpeed = Math.min(1.0, 12.0 * dt);
      this.cameraLagPos = Cesium.Cartesian3.lerp(
        this.cameraLagPos,
        targetCameraPos,
        lerpSpeed,
        new Cesium.Cartesian3()
      );
    }

    // Determine Look-At Target (ahead of hero)
    let lookTargetOffset;
    if (this.viewMode === 'firstPerson') {
      const fwdDist = 200.0;
      const fwdX = Math.sin(headingRad) * Math.cos(pitchRad) * fwdDist;
      const fwdY = Math.cos(headingRad) * Math.cos(pitchRad) * fwdDist;
      const fwdZ = Math.sin(pitchRad) * fwdDist;
      lookTargetOffset = new Cesium.Cartesian3(fwdX, fwdY, fwdZ + 0.4);
    } else if (this.viewMode === 'thirdPerson') {
      const fwdDist = 40.0;
      const fwdX = Math.sin(headingRad) * Math.cos(pitchRad) * fwdDist;
      const fwdY = Math.cos(headingRad) * Math.cos(pitchRad) * fwdDist;
      const fwdZ = Math.sin(pitchRad) * fwdDist;
      lookTargetOffset = new Cesium.Cartesian3(fwdX, fwdY, fwdZ + 0.8);
    } else {
      // Orbit targets hero center
      lookTargetOffset = new Cesium.Cartesian3(0, 0, 0.5);
    }

    const lookTargetWorld = Cesium.Matrix4.multiplyByPoint(
      enuTransform,
      lookTargetOffset,
      new Cesium.Cartesian3()
    );

    // Compute Direction and Up vectors
    const direction = Cesium.Cartesian3.subtract(
      lookTargetWorld,
      this.cameraLagPos,
      new Cesium.Cartesian3()
    );
    Cesium.Cartesian3.normalize(direction, direction);

    // Up vector normal to Earth surface
    const surfaceNormal = Cesium.Ellipsoid.WGS84.geodeticSurfaceNormal(heroCartesian);

    // Roll rotation around direction axis
    const up = Cesium.Cartesian3.clone(surfaceNormal);
    if (this.viewMode !== 'orbit' && Math.abs(physics.roll) > 0.1) {
      const rollQuaternion = Cesium.Quaternion.fromAxisAngle(
        direction,
        Cesium.Math.toRadians(-physics.roll * 0.4)
      );
      const rollMatrix = Cesium.Matrix3.fromQuaternion(rollQuaternion);
      Cesium.Matrix3.multiplyByVector(rollMatrix, up, up);
    }

    // Set camera view
    camera.setView({
      destination: this.cameraLagPos,
      orientation: {
        direction: direction,
        up: up
      }
    });
  }
}

