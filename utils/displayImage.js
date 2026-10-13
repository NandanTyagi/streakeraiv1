// Render at the device's native size instead of stretching a phone screenshot.
export const DISPLAY_WIDTH = 480;
export const DISPLAY_HEIGHT = 800;

export function displayDays(date = new Date()) {
  const start = Math.max(1, date.getDate() - 13);
  return Array.from({ length: 14 }, (_, i) => start + i);
}

export function drawDisplay(canvas, board, date = new Date()) {
  canvas.width = DISPLAY_WIDTH;
  canvas.height = DISPLAY_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Your browser could not create the display image.");
  const names = board.habitsNames || [];
  if (!names.length) throw new Error("Load your panel before sending it to the display.");
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, 480, 800);
  ctx.textBaseline = "middle";

  const text = (value, x, y, width, size = 16, bold = false) => {
    ctx.font = `${bold ? "bold " : ""}${size}px Arial, sans-serif`;
    ctx.fillStyle = "black";
    let label = String(value || "");
    while (label.length && ctx.measureText(label).width > width) label = label.slice(0, -1);
    if (label !== String(value || "")) label = label.slice(0, -1) + "…";
    ctx.fillText(label, x, y);
  };
  text("Streaker", 14, 26, 220, 26, true);
  text(date.toLocaleDateString("en-GB", { month: "short", year: "numeric" }).toUpperCase(), 335, 26, 132, 16, true);
  // Two lines for the intention, with predictable native-canvas text metrics.
  const title = String(board.goalToAchieve || "My intention");
  ctx.font = "bold 19px Arial, sans-serif";
  const words = title.split(/\s+/);
  let line = "", lines = [];
  for (const word of words) {
    if (line && ctx.measureText(`${line} ${word}`).width > 452) { lines.push(line); line = word; }
    else line = line ? `${line} ${word}` : word;
  }
  lines.push(line);
  text(lines[0], 14, 65, 452, 19, true);
  if (lines.length > 1) text(lines.slice(1).join(" "), 14, 88, 452, 19, true);
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(14, 107); ctx.lineTo(466, 107); ctx.stroke();
  const left = 58, gap = 5, width = (408 - gap * (names.length - 1)) / names.length;
  names.forEach((name, i) => {
    const x = left + i * (width + gap);
    text(name, x + 2, 128, width - 4, names.length > 5 ? 11 : 14, true);
    text(board.habitsValues?.[i], x + 2, 148, width - 4, 12);
  });
  const days = displayDays(date);
  days.forEach((day, row) => {
    const y = 169 + row * 42;
    const today = day === date.getDate();
    ctx.fillStyle = today ? "black" : "white";
    ctx.fillRect(12, y, 38, 37);
    ctx.font = "bold 17px Arial, sans-serif";
    ctx.fillStyle = today ? "white" : "black";
    ctx.fillText(String(day).padStart(2, "0"), 19, y + 12);
    ctx.font = "11px Arial, sans-serif";
    ctx.fillText(new Date(date.getFullYear(), date.getMonth(), day).toLocaleDateString("en-GB", { weekday: "short" }), 19, y + 28);
    names.forEach((_, col) => {
      const cell = board.cells?.find(c => c.rowNr === day && c.colNr === col + 1);
      const done = cell?.isClear === false && cell?.isDone === true;
      const missed = cell?.isClear === false && !cell?.isDone;
      const x = left + col * (width + gap);
      ctx.fillStyle = done ? "black" : "white";
      ctx.fillRect(x, y, width, 37);
      ctx.strokeStyle = "black"; ctx.lineWidth = today ? 2 : 1;
      ctx.strokeRect(x, y, width, 37);
      if (done || missed) {
        const cx = x + width / 2, cy = y + 18;
        ctx.strokeStyle = done ? "white" : "black"; ctx.lineWidth = 3;
        ctx.beginPath();
        if (done) { ctx.moveTo(cx - 8, cy); ctx.lineTo(cx - 2, cy + 6); ctx.lineTo(cx + 9, cy - 7); }
        else { ctx.moveTo(cx - 6, cy - 6); ctx.lineTo(cx + 6, cy + 6); ctx.moveTo(cx + 6, cy - 6); ctx.lineTo(cx - 6, cy + 6); }
        ctx.stroke();
      }
    });
  });
  text(`Updated ${date.toLocaleDateString("en-GB")} ${date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`, 14, 779, 452, 12);
  return canvas;
}
