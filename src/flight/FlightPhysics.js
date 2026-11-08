// Organic Human Flight & Spider-Man Free-Roam Physics
// Designed for stress-free open-world exploration with dive-swoop kinetic momentum

const EARTH_RADIUS = 6378137.0;

export class FlightPhysics {
  constructor() {
    // Spatial coordinates (WGS84)
    this.lon = -73.9857; // Manhattan start
    this.lat = 40.7484;
    this.alt = 45.0;     // Starts right between skyscrapers at street-level height (meters)

    // Human Orientation (degrees)
    this.heading = 45.0; // 0 = North, 90 = East, 180 = South, 270 = West
    this.pitch = 0.0;    // -85 (steep dive) to +85 (sky rocket)
    this.roll = 0.0;     // -60 to +60 (banking tilt)

    // Human Flight Dynamics
    this.speed = 120.0;       // Current speed in km/h
    this.targetSpeed = 120.0; // Target cruising speed in km/h
    this.maxSpeed = 24700.0;  // Mach 20 (~24,700 km/h)
    this.minSpeed = 0.0;      // 0 = Gentle floating hover

    // Kinetic Dive & Swoop parameters (Spider-Man web-wing / human glide feel)
    this.diveBonusSpeed = 0.0; // Stored kinetic energy gained from diving
    this.verticalSpeed = 0.0;  // m/s (climb or dive rate)
    this.currentMach = 0.10;

    // Human Maneuverability
    this.turnAgility = 70.0;  // Fluid, quick human turn response
    this.pitchAgility = 60.0; // Responsive dive/pull-up

    // Stress-Free Ground Safety: allows skimming right above roads and avenue level
    this.minAltitude = 2.0;      // Skim just 2 meters above street level
    this.maxAltitude = 500000.0; // Up to 500 km (Low Earth Orbit)

    // Human State
    this.pose = 'glide'; // 'hover', 'glide', 'dive', 'swoop', 'hypersonic'
    this.hoverTimer = 0;
    this.zenMode = true; // Stress-free exploration
  }

  getSpeedOfSound(altMeters) {
    let tempKelvin;
    if (altMeters < 11000) {
      tempKelvin = 288.15 - 0.0065 * altMeters;
    } else if (altMeters < 20000) {
      tempKelvin = 216.65;
    } else if (altMeters < 32000) {
      tempKelvin = 216.65 + 0.001 * (altMeters - 20000);
    } else {
      tempKelvin = 228.65;
    }
    return Math.sqrt(1.4 * 287.05 * Math.max(180, tempKelvin));
  }

  setTargetSpeed(kmh) {
    this.targetSpeed = Math.max(this.minSpeed, Math.min(this.maxSpeed, kmh));
  }

  teleport(lon, lat, alt, heading = 0, pitch = 0) {
    this.lon = lon;
    this.lat = lat;
    this.alt = Math.max(this.minAltitude, alt);
    this.heading = (heading + 360) % 360;
    this.pitch = pitch;
    this.roll = 0;
    this.speed = Math.min(this.speed, 600);
    this.targetSpeed = this.speed;
    this.diveBonusSpeed = 0;
  }

  update(dt, controls) {
    if (dt <= 0 || dt > 0.5) dt = 0.016;

    this.hoverTimer += dt;

    // 1. Human Pitch & Dive Maneuvers
    if (controls.pitchDown) {
      this.pitch = Math.max(-85, this.pitch - this.pitchAgility * dt);
    }
    if (controls.pitchUp) {
      this.pitch = Math.min(85, this.pitch + this.pitchAgility * dt);
    }

    // 2. Spider-Man Style Dive & Kinetic Swoop Physics
    // When pitching down steeply (diving), gravity converts altitude into massive kinetic speed!
    if (this.pitch < -15) {
      const diveFactor = -this.pitch / 85; // 0 to 1
      this.diveBonusSpeed += diveFactor * 450 * dt;
      this.pose = 'dive';
    } else if (this.pitch > 10 && this.diveBonusSpeed > 10) {
      // Pulling up: converting dive energy into an exhilarating upward swoop!
      this.pose = 'swoop';
      this.diveBonusSpeed = Math.max(0, this.diveBonusSpeed - 120 * dt);
    } else {
      // Gradually decay excess dive bonus
      this.diveBonusSpeed = Math.max(0, this.diveBonusSpeed - 60 * dt);
      if (this.speed > 5000) {
        this.pose = 'hypersonic';
      } else if (this.speed < 25) {
        this.pose = 'hover';
      } else {
        this.pose = 'glide';
      }
    }

    // 3. Speed Integration
    let targetWithDive = this.targetSpeed + this.diveBonusSpeed;
    if (controls.boost) {
      targetWithDive = Math.min(this.maxSpeed, targetWithDive * 1.5 + 2500 * dt);
    }
    if (controls.brake) {
      targetWithDive = Math.max(0, targetWithDive * 0.7 - 1800 * dt);
      this.diveBonusSpeed = 0;
    }

    // Organic speed lerp (fluid human acceleration)
    const accelRate = controls.boost ? 3200 : (targetWithDive > this.speed ? 1400 : 2200);
    if (this.speed < targetWithDive) {
      this.speed = Math.min(targetWithDive, this.speed + accelRate * dt);
    } else if (this.speed > targetWithDive) {
      this.speed = Math.max(targetWithDive, this.speed - accelRate * dt);
    }

    // Calculate local Mach
    const speedMs = this.speed / 3.6;
    const soundSpeed = this.getSpeedOfSound(this.alt);
    this.currentMach = speedMs / soundSpeed;

    // 4. Acrobatic Banking and Turning
    const turnSensitivity = Math.max(0.4, 1.0 - (this.speed / this.maxSpeed) * 0.5);

    if (controls.rollLeft) {
      this.roll = Math.max(-55, this.roll - 110 * dt);
    } else if (controls.rollRight) {
      this.roll = Math.min(55, this.roll + 110 * dt);
    } else {
      // Auto-re-center human body roll gracefully
      this.roll *= Math.max(0, 1.0 - 5.0 * dt);
    }

    // Coordinated banking turn:
    // When banking Left (roll < 0), heading decreases (counter-clockwise -> turns LEFT).
    // When banking Right (roll > 0), heading increases (clockwise -> turns RIGHT).
    const bankTurn = Math.sin((this.roll * Math.PI) / 180) * this.turnAgility * turnSensitivity;
    this.heading = (this.heading + bankTurn * dt + 360) % 360;

    // Rudder / Quick turns (Q / E)
    if (controls.yawLeft) {
      this.heading = (this.heading - 60 * turnSensitivity * dt + 360) % 360;
      this.roll = Math.max(-35, this.roll - 45 * dt);
    }
    if (controls.yawRight) {
      this.heading = (this.heading + 60 * turnSensitivity * dt) % 360;
      this.roll = Math.min(35, this.roll + 45 * dt);
    }

    // Mouse steering
    if (controls.mouseDeltaX) {
      this.heading = (this.heading + controls.mouseDeltaX * 0.20 + 360) % 360;
      this.roll = Math.max(-45, Math.min(45, this.roll + controls.mouseDeltaX * 0.25));
      controls.mouseDeltaX = 0;
    }
    if (controls.mouseDeltaY) {
      this.pitch = Math.max(-85, Math.min(85, this.pitch - controls.mouseDeltaY * 0.16));
      controls.mouseDeltaY = 0;
    }

    // 5. Velocity Vectors & Vertical Motion
    const pitchRad = (this.pitch * Math.PI) / 180;
    const headingRad = (this.heading * Math.PI) / 180;

    let extraZ = 0;
    if (controls.ascend) {
      extraZ = Math.max(50, speedMs * 0.85 + 60);
    }
    if (controls.descend) {
      extraZ = -Math.max(50, speedMs * 0.85 + 60);
    }

    // Hover floating micro-oscillation (human breathing float when still)
    if (this.speed < 20) {
      extraZ += Math.sin(this.hoverTimer * 2.2) * 0.8;
    }

    const horizSpeedMs = speedMs * Math.cos(pitchRad);
    const vx = horizSpeedMs * Math.sin(headingRad); // East
    const vy = horizSpeedMs * Math.cos(headingRad); // North
    const vz = speedMs * Math.sin(pitchRad) + extraZ; // Up

    this.verticalSpeed = vz;

    // Update Altitude
    this.alt += vz * dt;

    // Street-level gliding: soft cushion near ground so you can fly 2m above roads without getting stuck
    if (this.alt < 4.0) {
      if (this.pitch < 0) {
        this.pitch *= Math.max(0, 1.0 - 4.0 * dt);
      }
      this.alt = Math.max(this.minAltitude, this.alt);
    }
    this.alt = Math.min(this.maxAltitude, this.alt);

    // Update Geodesic Latitude and Longitude
    const latRad = (this.lat * Math.PI) / 180;
    const dLat = (vy * dt) / EARTH_RADIUS;
    const dLon = (vx * dt) / (EARTH_RADIUS * Math.cos(latRad));

    this.lat += (dLat * 180) / Math.PI;
    this.lon += (dLon * 180) / Math.PI;

    if (this.lon > 180) this.lon -= 360;
    if (this.lon < -180) this.lon += 360;
    this.lat = Math.max(-89.9, Math.min(89.9, this.lat));
  }
}
