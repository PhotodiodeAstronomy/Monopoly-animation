const canvas = document.getElementById('animation');
const ctx = canvas.getContext('2d');
const caption = document.getElementById('caption');

canvas.width = 800;
canvas.height = 600;

// Scale: Q 0-200 left-right, $ 0-200 bottom-top (invert Y for canvas)
const scaleX = 4; // 200 units -> 800px
const scaleY = -3; // 200 units -> 600px, inverted
const originX = 50;
const originY = 550;

function clear() { ctx.clearRect(0, 0, canvas.width, canvas.height); }
function drawAxes() {
  ctx.strokeStyle = '#666'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(originX, 50); ctx.lineTo(originX, originY); ctx.stroke(); // Y axis
  ctx.beginPath(); ctx.moveTo(originX, originY); ctx.lineTo(750, originY); ctx.stroke(); // X axis
  ctx.fillText('Q', 760, originY + 15); ctx.fillText('$', originX - 10, 60);
}

// Curve functions (same math as before)
function atc(q) { return 50 + 1000 / q + 0.01 * q * q; }
function mc(q) { return 50 + 0.02 * q; }
function drawCurve(fn, color, width = 3, from = 10, to = 200, alpha = 1) {
  ctx.strokeStyle = color; ctx.lineWidth = width; ctx.globalAlpha = alpha;
  ctx.beginPath();
  let x = from; ctx.moveTo(originX + x * scaleX, originY + fn(x) * scaleY);
  for (let i = from + 1; i <= to; i++) {
    x = i; ctx.lineTo(originX + x * scaleX, originY + fn(x) * scaleY);
  }
  ctx.stroke(); ctx.globalAlpha = 1;
}
function drawLine(x1, y1, x2, y2, color, width = 3, dashed = false) {
  ctx.strokeStyle = color; ctx.lineWidth = width;
  if (dashed) ctx.setLineDash([10, 5]); else ctx.setLineDash([]);
  ctx.beginPath(); ctx.moveTo(originX + x1 * scaleX, originY + y1 * scaleY);
  ctx.lineTo(originX + x2 * scaleX, originY + y2 * scaleY); ctx.stroke(); ctx.setLineDash([]);
}
function drawDot(x, y, r = 8, color) {
  ctx.fillStyle = color; ctx.beginPath(); ctx.arc(originX + x * scaleX, originY + y * scaleY, r, 0, 2 * Math.PI); ctx.fill();
}
function drawText(text, x, y, color = '#000', size = 14) {
  ctx.fillStyle = color; ctx.font = `${size}px sans-serif`; ctx.fillText(text, originX + x * scaleX, originY + y * scaleY);
}
function drawPolygon(points, color, opacity = 0.7) {
  ctx.fillStyle = color; ctx.globalAlpha = opacity;
  ctx.beginPath(); ctx.moveTo(originX + points[0][0] * scaleX, originY + points[0][1] * scaleY);
  for (let i = 1; i < points.length; i++) {
    ctx.lineTo(originX + points[i][0] * scaleX, originY + points[i][1] * scaleY);
  }
  ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
}

// Animation timeline
let time = 0;
const duration = 20000; // 20s total
function animate() {
  clear(); drawAxes();
  const progress = time / duration;

  // Phase 1: Perfect Competition (0-40%)
  if (progress < 0.4) {
    caption.textContent = "Perfect Competition – all three points coincide";
    const fade = progress / 0.4;
    drawCurve(atc, '#1f77b4', 3, 10, 200, fade); // ATC
    drawCurve(mc, '#ff7f0e', 3, 10, 200, fade); // MC
    drawLine(0, 90, 200, 90, '#2ca02c', 3, false); // P = 90
    if (fade > 0.5) drawDot(100, 90, 8, '#9467bd'); // Single dot
    if (progress > 0.2) drawText("All three coincide here", 100, 60, '#9467bd', 16);
  }
  // Phase 2: Transition to Monopoly (40-70%)
  else if (progress < 0.7) {
    caption.textContent = "Now the same industry becomes a monopoly…";
    drawCurve(atc, '#1f77b4'); drawCurve(mc, '#ff7f0e');
    const trans = (progress - 0.4) / 0.3;
    // Fade out Pcomp
    drawLine(0, 90 + trans * 35, 200, 90 + trans * 35, '#2ca02c', 3, false); // Morph to higher P
    // Draw demand and MR
    if (trans > 0.3) drawLine(0, 200, 200, 0, '#d62728'); // Demand
    if (trans > 0.5) drawLine(0, 200, 100, 0, '#d62728', 3, true); // MR dashed
    // Start splitting dot
    if (trans > 0.7) {
      drawDot(100 - (trans - 0.7) * 25 * 4, 90 + (trans - 0.7) * 35 * 4, 8, '#e377c2'); // Pink to (75,125)
      if (trans > 0.8) drawDot(100, 90, 8, '#1f77b4'); // Blue stays
      if (trans > 0.9) drawDot(150, 90, 8, '#2ca02c'); // Green to 150
    }
  }
  // Phase 3: Monopoly Final (70-100%)
  else {
    caption.textContent = "Monopoly: three separate points = inefficiency + rents";
    drawCurve(atc, '#1f77b4'); drawCurve(mc, '#ff7f0e');
    drawLine(0, 200, 200, 0, '#d62728'); // Demand
    drawLine(0, 200, 100, 0, '#d62728', 3, true); // MR
    drawDot(75, 125, 8, '#e377c2'); // Profit-max
    drawDot(100, 90, 8, '#1f77b4'); // Min ATC
    drawDot(150, 90, 8, '#2ca02c'); // Social
    drawPolygon([[75,125],[150,90],[150,125]], '#ff9999'); // DWL triangle
    drawText("Profit-max Q", 75, 140, '#e377c2', 16);
    drawText("Min efficient scale", 100, 70, '#1f77b4', 16);
    drawText("Social optimum", 150, 70, '#2ca02c', 16);
  }

  time = (time + 16) % duration; // ~60fps loop
  requestAnimationFrame(animate);
}

animate(); // Start the loop
