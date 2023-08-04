import type { TilePosition } from '../types/tile-position';
import type { TileShape } from '../types/tile-shape';

const crossTileShape: TileShape = (origin: TilePosition, {size = 1, includeOrigin}): TilePosition[] => {
  const shape: TilePosition[] = [];

  for (let i = 1; i <= size; i++) {
    shape.push({...origin, x: origin.x + i});
    shape.push({...origin, x: origin.x - i});
    shape.push({...origin, y: origin.y + i});
    shape.push({...origin, y: origin.y - i});
  }

  if (includeOrigin) {
    shape.push(origin);
  }

  return shape;
}

export default crossTileShape;
