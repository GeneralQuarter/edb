import Map from '../map';
import { TilePosition } from './tile-position';

export type ShapeOptions = {
  map: Map;
  size?: number;
  includeOrigin?: boolean;
}

export type TileShape = (origin: TilePosition, options: ShapeOptions) => TilePosition[];
