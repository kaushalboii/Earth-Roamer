// Sonic Boom & Shockwave Visual Effect

export class SonicBoomVFX {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.activeRipples = [];
  }

  trigger() {
    const cx = this.canvas.width / 2;
    const cy = this.canvas.height / 2;

    this.activeRipples.push({
      x: cx,
      y: cy,
      radius: 20,
      maxRadius: Math.max(this.canvas.width, this.canvas.height) * 0.9,
      alpha: 1.0,
      lineWidth: 18,
      speed: 1200 // px per sec
    });
  }

  update(dt) {
    if (this.activeRipples.length === 0) return;

    for (let i = this.activeRipples.length - 1; i >= 0; i--) {
      const rip = this.activeRipples[i];
      rip.radius += rip.speed * dt;
      rip.alpha = Math.max(0, 1.0 - (rip.radius / rip.maxRadius));
      rip.lineWidth = Math.max(1, 18 * (1.0 - rip.radius / rip.maxRadius));

      if (rip.alpha <= 0.01) {
        this.activeRipples.splice(i, 1);
        continue;
      }

      // Draw expanding vapor shockwave ring
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
      this.ctx.strokeStyle = `rgba(240, 250, 255, ${rip.alpha * 0.85})`;
      this.ctx.lineWidth = rip.lineWidth;
      this.ctx.shadowColor = '#38bdf8';
      this.ctx.shadowBlur = 25;
      this.ctx.stroke();

      // Outer secondary ripple
      this.ctx.beginPath();
      this.ctx.arc(rip.x, rip.y, rip.radius * 0.85, 0, Math.PI * 2);
      this.ctx.strokeStyle = `rgba(180, 220, 255, ${rip.alpha * 0.4})`;
      this.ctx.lineWidth = rip.lineWidth * 0.5;
      this.ctx.stroke();

      this.ctx.restore();
    }
  }
}

