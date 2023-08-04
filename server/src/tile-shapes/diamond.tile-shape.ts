import type { TilePosition } from '../types/tile-position';
import type { TileShape } from '../types/tile-shape';
import crossTileShape from './cross.tile-shape';

const diamondTileShape: TileShape = (origin: TilePosition, {size = 1, includeOrigin, map}): TilePosition[] => {
  const shape = crossTileShape(origin, {size, includeOrigin, map});

  if (size === 1) {
    return shape;
  }

  for (let i = 1; i < size; i++) {
    let k = i;

    for (let j = 1; j <= i; j++, k--) {
      shape.push({x: origin.x - k, y: origin.y + j});
      shape.push({x: origin.x + k, y: origin.y - j});
      shape.push({x: origin.x - k, y: origin.y - j});
      shape.push({x: origin.x + k, y: origin.y + j});
    }
  }

  return shape;
}

export default diamondTileShape;
