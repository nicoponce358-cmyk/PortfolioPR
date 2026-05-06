// ── SCROLL REVEAL ─────────────────────────────────────────
const reveals  = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

reveals.forEach(el => observer.observe(el));


// ── NAV BORDER ON SCROLL ──────────────────────────────────
const nav = document.querySelector('nav');
window.addEventListener('scroll', () => {
  nav.style.borderBottomColor = window.scrollY > 10
    ? 'var(--border)'
    : 'transparent';
}, { passive: true });


// ── ACTIVE NAV LINK ───────────────────────────────────────
const sections    = document.querySelectorAll('section[id]');
const links       = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      links.forEach(l => l.style.color = '');
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.style.color = 'var(--text)';
    }
  });
}, { threshold: 0.5 });

sections.forEach(s => navObserver.observe(s));

// ── ANIMATED GEOMETRIC BACKGROUND ────────────────────────
const canvas = document.createElement('canvas');
canvas.id = 'bg-canvas';
Object.assign(canvas.style, {
  position: 'fixed', inset: '0', width: '100%', height: '100%',
  zIndex: '-1', pointerEvents: 'none', opacity: '0.55'
});
document.body.prepend(canvas);

const ctx = canvas.getContext('2d');
let W, H, shapes;

const BLUE = getComputedStyle(document.documentElement)
  .getPropertyValue('--accent').trim() || '#2563eb';

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `${r},${g},${b}`;
}

function makeShape() {
  const types = ['triangle', 'square', 'hexagon', 'dot'];
  return {
    type: types[Math.floor(Math.random() * types.length)],
    x: Math.random() * W,
    y: Math.random() * H,
    size: 10 + Math.random() * 28,
    speed: 0.12 + Math.random() * 0.25,
    angle: Math.random() * Math.PI * 2,
    drift: (Math.random() - 0.5) * 0.004,
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.006,
    alpha: 0.06 + Math.random() * 0.1,
    filled: Math.random() > 0.6,
  };
}

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
  shapes = Array.from({ length: 38 }, makeShape);
}

function drawTriangle(x, y, size, rotation, alpha, filled) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.beginPath();
  for (let i = 0; i < 3; i++) {
    const a = (i * 2 * Math.PI) / 3 - Math.PI / 2;
    i === 0 ? ctx.moveTo(Math.cos(a)*size, Math.sin(a)*size)
             : ctx.lineTo(Math.cos(a)*size, Math.sin(a)*size);
  }
  ctx.closePath();
  const rgb = hexToRgb(BLUE);
  if (filled) { ctx.fillStyle = `rgba(${rgb},${alpha * 0.5})`; ctx.fill(); }
  ctx.strokeStyle = `rgba(${rgb},${alpha})`;
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();
}

function drawSquare(x, y, size, rotation, alpha, filled) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.beginPath();
  ctx.rect(-size/2, -size/2, size, size);
  const rgb = hexToRgb(BLUE);
  if (filled) { ctx.fillStyle = `rgba(${rgb},${alpha * 0.5})`; ctx.fill(); }
  ctx.strokeStyle = `rgba(${rgb},${alpha})`;
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();
}

function drawHexagon(x, y, size, rotation, alpha, filled) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3;
    i === 0 ? ctx.moveTo(Math.cos(a)*size, Math.sin(a)*size)
             : ctx.lineTo(Math.cos(a)*size, Math.sin(a)*size);
  }
  ctx.closePath();
  const rgb = hexToRgb(BLUE);
  if (filled) { ctx.fillStyle = `rgba(${rgb},${alpha * 0.4})`; ctx.fill(); }
  ctx.strokeStyle = `rgba(${rgb},${alpha})`;
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();
}

function drawDot(x, y, size, alpha) {
  const rgb = hexToRgb(BLUE);
  ctx.beginPath();
  ctx.arc(x, y, size * 0.25, 0, Math.PI * 2);
  ctx.fillStyle = `rgba(${rgb},${alpha * 1.4})`;
  ctx.fill();
}

function animate() {
  ctx.clearRect(0, 0, W, H);

  for (const s of shapes) {
    s.y -= s.speed;
    s.x += Math.sin(s.angle) * 0.3;
    s.angle += s.drift;
    s.rotation += s.rotSpeed;
    if (s.y + s.size < 0) { s.y = H + s.size; s.x = Math.random() * W; }

    if      (s.type === 'triangle') drawTriangle(s.x, s.y, s.size, s.rotation, s.alpha, s.filled);
    else if (s.type === 'square')   drawSquare(s.x, s.y, s.size, s.rotation, s.alpha, s.filled);
    else if (s.type === 'hexagon')  drawHexagon(s.x, s.y, s.size, s.rotation, s.alpha, s.filled);
    else                            drawDot(s.x, s.y, s.size, s.alpha);
  }

  requestAnimationFrame(animate);
}

window.addEventListener('resize', resize);
resize();
animate();