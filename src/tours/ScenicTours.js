import * as Cesium from 'cesium';

export const SCENIC_TOURS = [
  {
    id: 'nyc_slalom',
    name: '🗽 Manhattan Skyline Glide',
    desc: 'Soar through Manhattan avenues, skim past skyscrapers, and glide over Central Park.',
    rings: [
      { lon: -73.9857, lat: 40.7484, alt: 380, radius: 45 },
      { lon: -73.9830, lat: 40.7530, alt: 320, radius: 40 },
      { lon: -73.9800, lat: 40.7580, alt: 260, radius: 40 },
      { lon: -73.9740, lat: 40.7640, alt: 200, radius: 45 },
      { lon: -73.9680, lat: 40.7720, alt: 160, radius: 50 }, // Central Park entrance
      { lon: -73.9650, lat: 40.7800, alt: 120, radius: 55 }
    ]
  },
  {
    id: 'grandcanyon_run',
    name: '🏜️ Grand Canyon River Run',
    desc: 'Supersonic canyon carving along the Colorado River between red cliffs.',
    rings: [
      { lon: -112.1401, lat: 36.0544, alt: 2200, radius: 60 },
      { lon: -112.1550, lat: 36.0620, alt: 1800, radius: 55 },
      { lon: -112.1700, lat: 36.0700, alt: 1400, radius: 50 },
      { lon: -112.1900, lat: 36.0820, alt: 1100, radius: 50 }
    ]
  },
  {
    id: 'paris_seine',
    name: '🗼 Paris Seine River Cruise',
    desc: 'Skim water reflections past Notre-Dame and loop around the Eiffel Tower.',
    rings: [
      { lon: 2.2945, lat: 48.8584, alt: 300, radius: 45 },
      { lon: 2.3050, lat: 48.8620, alt: 220, radius: 40 },
      { lon: 2.3200, lat: 48.8640, alt: 150, radius: 40 },
      { lon: 2.3350, lat: 48.8600, alt: 90,  radius: 45 }
    ]
  }
];

export class ScenicToursManager {
  constructor(viewer, audioManager) {
    this.viewer = viewer;
    this.audio = audioManager;
    this.activeTour = null;
    this.currentRingIdx = 0;
    this.ringEntities = [];
    this.isActive = false;
  }

  startTour(tourId) {
    this.clearRings();
    const tour = SCENIC_TOURS.find(t => t.id === tourId);
    if (!tour) return;

    this.activeTour = tour;
    this.currentRingIdx = 0;
    this.isActive = true;

    this.spawnRings();
  }

  stopTour() {
    this.clearRings();
    this.activeTour = null;
    this.isActive = false;
  }

  clearRings() {
    for (const ent of this.ringEntities) {
      this.viewer.entities.remove(ent);
    }
    this.ringEntities = [];
  }

  spawnRings() {
    if (!this.activeTour) return;

    this.activeTour.rings.forEach((r, idx) => {
      const position = Cesium.Cartesian3.fromDegrees(r.lon, r.lat, r.alt);
      const isNext = idx === this.currentRingIdx;

      // Aerial Glowing Torus Ring
      const ring = this.viewer.entities.add({
        position: position,
        ellipse: {
          semiMinorAxis: r.radius,
          semiMajorAxis: r.radius,
          material: new Cesium.ColorMaterialProperty(
            isNext ? Cesium.Color.fromCssColorString('#38bdf8').withAlpha(0.7) :
                     Cesium.Color.fromCssColorString('#a855f7').withAlpha(0.35)
          ),
          outline: true,
          outlineColor: isNext ? Cesium.Color.WHITE : Cesium.Color.fromCssColorString('#a855f7'),
          outlineWidth: 3,
          height: r.alt
        }
      });

      this.ringEntities.push(ring);
    });
  }

  update(physics) {
    if (!this.isActive || !this.activeTour) return;

    const ring = this.activeTour.rings[this.currentRingIdx];
    if (!ring) return;

    // Check distance between human and target ring
    const dLat = (physics.lat - ring.lat) * 111320;
    const dLon = (physics.lon - ring.lon) * 111320 * Math.cos((physics.lat * Math.PI) / 180);
    const dAlt = physics.alt - ring.alt;
    const dist = Math.hypot(dLat, dLon, dAlt);

    if (dist < ring.radius * 1.5) {
      // Ring passed!
      this.triggerRingChime();
      this.currentRingIdx++;

      if (this.currentRingIdx >= this.activeTour.rings.length) {
        // Tour completed! Loop or celebrate
        this.currentRingIdx = 0;
      }

      this.updateRingHighlights();
    }
  }

  updateRingHighlights() {
    this.ringEntities.forEach((ent, idx) => {
      const isNext = idx === this.currentRingIdx;
      if (ent.ellipse) {
        ent.ellipse.material = new Cesium.ColorMaterialProperty(
          isNext ? Cesium.Color.fromCssColorString('#38bdf8').withAlpha(0.8) :
                   Cesium.Color.fromCssColorString('#a855f7').withAlpha(0.3)
        );
      }
    });
  }

  triggerRingChime() {
    if (!this.audio || !this.audio.ctx) return;
    const ctx = this.audio.ctx;
    const t = ctx.currentTime;

    // Peaceful celestial harmonic chime (A5 chord tone)
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, t); // A5
    osc.frequency.exponentialRampToValueAtTime(1320, t + 0.4); // E6

    gain.gain.setValueAtTime(0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.9);
  }
}

