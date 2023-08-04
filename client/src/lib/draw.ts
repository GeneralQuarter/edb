import type { TilePosition } from '../types/tile-position';
import { isTileInMap } from './board';

export function drawBackground(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.fillStyle = "rgba(114, 186, 80)";
  ctx.fillRect(0, 0, width, height);
}

export function drawGrid(ctx: CanvasRenderingContext2D, width: number, height: number, tileSize: number) {

  for (let x = 0; x <= width; x += tileSize) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
  }

  for (let y = 0; y <= height; y += tileSize) {
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
  }

  ctx.strokeStyle = "rgb(85, 143, 57)";
  ctx.stroke();
}

export function drawImage(ctx: CanvasRenderingContext2D, image: HTMLImageElement, position: TilePosition, tileSize: number, padding: number) {
  const ratio = image.width / image.height;
  const dHeight = tileSize - (padding * 2);
  const dWidth = dHeight * ratio;
  const dx = (tileSize * position.x) + (tileSize / 2) - (dWidth / 2);
  const dy = (tileSize * position.y) + padding;
  ctx.drawImage(image, 0, 0, image.width, image.height, dx, dy, dWidth, dHeight);
}

export function drawShape(ctx: CanvasRenderingContext2D, shapeTiles: TilePosition[], tileSize: number) {
  if (shapeTiles.length === 0) {
    return;
  }

  for (const tile of shapeTiles) {
    const x = (tileSize * tile.x);
    const y = (tileSize * tile.y);

    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    ctx.fillRect(x, y, tileSize, tileSize);
  }
}
