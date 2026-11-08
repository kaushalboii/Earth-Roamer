// Real-Time Global Mini-Map with Position and Heading

export class MiniMap {
  constructor(canvas) {
    this.canvas = canvas;
    if (canvas) {
      this.ctx = canvas.getContext('2d');
      this.width = canvas.width;
      this.height = canvas.height;
    }
  }

  update(lon, lat, heading) {
    if (!this.canvas || !this.ctx) return;
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    ctx.clearRect(0, 0, w, h);

    // Dark Earth Globe ocean background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, h);

    // Subtle coordinate grid
    ctx.strokeStyle = 'rgba(51, 65, 85, 0.4)';
    ctx.lineWidth = 1;

    // Equator & Prime meridian
    const equatorY = h / 2;
    const primeMeridianX = w / 2;

    ctx.beginPath();
    ctx.moveTo(0, equatorY);
    ctx.lineTo(w, equatorY);
    ctx.moveTo(primeMeridianX, 0);
    ctx.lineTo(primeMeridianX, h);
    ctx.stroke();

    // Map latitude/longitude to canvas coords (Equirectangular projection)
    // lon: -180 to +180 -> 0 to w
    // lat: +90 to -90 -> 0 to h
    const heroX = ((lon + 180) / 360) * w;
    const heroY = ((90 - lat) / 180) * h;

    // Outer glow for superhero marker
    const grad = ctx.createRadialGradient(heroX, heroY, 2, heroX, heroY, 14);
    grad.addColorStop(0, 'rgba(56, 189, 248, 1)');
    grad.addColorStop(0.5, 'rgba(14, 165, 233, 0.4)');
    grad.addColorStop(1, 'rgba(14, 165, 233, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(heroX, heroY, 14, 0, Math.PI * 2);
    ctx.fill();

    // Hero Direction Arrow
    ctx.save();
    ctx.translate(heroX, heroY);
    const headingRad = (heading * Math.PI) / 180;
    ctx.rotate(headingRad);

    ctx.fillStyle = '#ef4444'; // Superman Red
    ctx.beginPath();
    ctx.moveTo(0, -9);
    ctx.lineTo(5, 5);
    ctx.lineTo(0, 2);
    ctx.lineTo(-5, 5);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    // Border
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(0, 0, w, h);
  }
}

