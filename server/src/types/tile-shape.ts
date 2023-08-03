import Map from '../map';
import { TilePosition } from './tile-position';

type ShapeOptions = {
  map: Map;
  size?: number;
  includeOrigin?: number;
}

export type TileShape = (origin: TilePosition, options: ShapeOptions) => TilePosition[];
