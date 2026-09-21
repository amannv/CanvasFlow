import { WorldToScreen } from "./types";

export function drawGrid(
  ctx: CanvasRenderingContext2D,
  worldToScreen: WorldToScreen
) {
  const origin = worldToScreen(0, 0);
  const scale = origin.scale;

  const smallGridSize = 20 * scale;

  const dpr = window.devicePixelRatio || 1;
  

  ctx.lineWidth = 1 / dpr;

  
  const getCrispPosition = (pos: number) => {
    const idealPhysicalLeft = Math.round(pos * dpr - 0.5);
    return (idealPhysicalLeft + 0.5) / dpr;
  };

  const startI = Math.ceil(-origin.screenX / smallGridSize);
  const endI = Math.ceil((window.innerWidth - origin.screenX) / smallGridSize);

  const startJ = Math.ceil(-origin.screenY / smallGridSize);
  const endJ = Math.ceil((window.innerHeight - origin.screenY) / smallGridSize);

  
  if (smallGridSize >= 15) {
    ctx.beginPath();
    ctx.strokeStyle = "rgba(0, 0, 0, 0.12)"; 
    ctx.setLineDash([4, 4]);
    for (let i = startI; i <= endI; i++) {
      if (i % 5 !== 0) { 
        const x = getCrispPosition(origin.screenX + i * smallGridSize);
        ctx.moveTo(x, 0);
        ctx.lineTo(x, window.innerHeight);
      }
    }
    for (let j = startJ; j <= endJ; j++) {
      if (j % 5 !== 0) { 
        const y = getCrispPosition(origin.screenY + j * smallGridSize);
        ctx.moveTo(0, y);
        ctx.lineTo(window.innerWidth, y);
      }
    }
    ctx.stroke();
  }

  
  if (smallGridSize * 5 >= 4) {
    ctx.beginPath();
    ctx.strokeStyle = "rgba(0, 0, 0, 0.22)"; 
    ctx.setLineDash([]);
    for (let i = startI; i <= endI; i++) {
      if (i % 5 === 0) { 
        const x = getCrispPosition(origin.screenX + i * smallGridSize);
        ctx.moveTo(x, 0);
        ctx.lineTo(x, window.innerHeight);
      }
    }
    for (let j = startJ; j <= endJ; j++) {
      if (j % 5 === 0) { 
        const y = getCrispPosition(origin.screenY + j * smallGridSize);
        ctx.moveTo(0, y);
        ctx.lineTo(window.innerWidth, y);
      }
    }
    ctx.stroke();
  }
}
