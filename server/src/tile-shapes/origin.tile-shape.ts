import type { TilePosition } from '../types/tile-position';
import type { TileShape } from '../types/tile-shape';

const originTileShape: TileShape = (origin: TilePosition): TilePosition[] => {
  return [origin];
}

export default originTileShape;
