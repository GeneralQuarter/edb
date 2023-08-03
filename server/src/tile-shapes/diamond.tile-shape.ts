import type { TilePosition } from '../types/tile-position';
import type { TileShape } from '../types/tile-shape';
import Cross from './cross.tile-shape';

const DiamondTileShape: TileShape = (origin: TilePosition, {size = 1, includeOrigin, map}): TilePosition[] => {
  const shape = Cross(origin, {size, includeOrigin, map});

  if (size === 1) {
    return shape;
  }

  for (let i = 1; i < size; i++) {
    let k = i;

    for (let j = 1; j <= i; j++, k++) {
      shape.push({x: origin.x - k, y: origin.y + j});
      shape.push({x: origin.x + k, y: origin.y - j});
      shape.push({x: origin.x - k, y: origin.y - j});
      shape.push({x: origin.x + k, y: origin.y + j});
    }
  }

  return shape;
}

export default DiamondTileShape;
