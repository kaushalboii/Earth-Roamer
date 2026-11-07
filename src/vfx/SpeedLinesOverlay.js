// Radial Hyperspeed / Warp Speed Lines Overlay (Canvas2D)

export class SpeedLinesOverlay {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.lines = [];
    this.maxLines = 120;
    this.resize();

    window.addEventListener('resize', () => this.resize());
    this.initLines();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.centerX = this.width / 2;
    this.centerY = this.height / 2;
  }

  initLines() {
    this.lines = [];
    for (let i = 0; i < this.maxLines; i++) {
      this.lines.push(this.createLine());
    }
  }

  createLine() {
    const angle = Math.random() * Math.PI * 2;
    const dist = 60 + Math.random() * (Math.min(this.width, this.height) * 0.45);
    return {
      angle,
      dist,
      speed: 400 + Math.random() * 800,
      length: 20 + Math.random() * 60,
      width: 1.0 + Math.random() * 2.0,
      alpha: 0.1 + Math.random() * 0.6
    };
  }

  update(dt, speedKmh, maxSpeed = 24700) {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Only active above 600 km/h (subsonic to hypersonic)
    if (speedKmh < 600) return;

    const intensity = Math.min(1.0, (speedKmh - 600) / 10000);
    const activeCount = Math.floor(this.maxLines * intensity);

    const isHypersonic = speedKmh > 6175; // Mach 5+
    const isMach20 = speedKmh > 20000;

    // Line color varies from white/cyan (transonic) to plasma gold/cyan/purple (hypersonic)
    let strokeStyle = `rgba(220, 245, 255, ${0.4 * intensity})`;
    if (isMach20) {
      strokeStyle = `rgba(255, 140, 60, ${0.7 * intensity})`;
    } else if (isHypersonic) {
      strokeStyle = `rgba(160, 220, 255, ${0.55 * intensity})`;
    }

    this.ctx.lineWidth = 1.5;
    this.ctx.strokeStyle = strokeStyle;
    this.ctx.beginPath();

    const maxDist = Math.hypot(this.width, this.height) / 2;

    for (let i = 0; i < activeCount; i++) {
      const line = this.lines[i];
      line.dist += line.speed * (speedKmh / 2000) * dt;

      if (line.dist > maxDist) {
        line.dist = 40 + Math.random() * 80;
        line.angle = Math.random() * Math.PI * 2;
      }

      const x1 = this.centerX + Math.cos(line.angle) * line.dist;
      const y1 = this.centerY + Math.sin(line.angle) * line.dist;
      const x2 = this.centerX + Math.cos(line.angle) * (line.dist + line.length * intensity * 2.0);
      const y2 = this.centerY + Math.sin(line.angle) * (line.dist + line.length * intensity * 2.0);

      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
    }

    this.ctx.stroke();

    // Hypersonic screen edge plasma vignette
    if (isHypersonic) {
      const grad = this.ctx.createRadialGradient(
        this.centerX, this.centerY, Math.min(this.width, this.height) * 0.45,
        this.centerX, this.centerY, Math.max(this.width, this.height) * 0.75
      );
      const alpha = Math.min(0.35, (speedKmh / maxSpeed) * 0.4);
      grad.addColorStop(0, 'rgba(255, 120, 30, 0)');
      grad.addColorStop(1, `rgba(255, 90, 20, ${alpha})`);

      this.ctx.fillStyle = grad;
      this.ctx.fillRect(0, 0, this.width, this.height);
    }
  }
}

