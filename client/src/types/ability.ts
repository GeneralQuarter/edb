import type { TileShapeReference } from './tile-shape-reference';

export type Ability = {
  id: string;
  name: string;
  reach?: TileShapeReference;
  impact: TileShapeReference;
}
