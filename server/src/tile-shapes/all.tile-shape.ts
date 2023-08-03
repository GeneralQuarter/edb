import type { TilePosition } from '../types/tile-position';
import type { TileShape } from '../types/tile-shape';

const AllTileShape: TileShape = (origin: TilePosition, {map, includeOrigin}): TilePosition[] => {
  const shape = map.getAllTiles();

  if (!includeOrigin) {
    const originIndex = map.toTileIndex(origin);
    shape.splice(originIndex, 1);
  }

  return shape;
}

export default AllTileShape;
