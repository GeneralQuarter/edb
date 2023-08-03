import EventBus from '../event-bus';
import Game from '../game';
import type { Entity } from './entity';
import type { TilePosition } from './tile-position';
import type { TileShapeReference } from './tile-shape-reference';

export type AbilityBlueprint = {
  name: string;
  reach?: TileShapeReference;
  impact: TileShapeReference;
  cast: (game: Game, eventBus: EventBus, caster: Entity, target: TilePosition, impact: TilePosition[]) => void;
}
