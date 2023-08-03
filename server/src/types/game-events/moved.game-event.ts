import type { GameEvent } from '../game-event';
import { TilePosition } from '../tile-position';

export type MovedData = {
  entityId: number;
  from: TilePosition;
  to: TilePosition;
}

export type MovedGameEvent = GameEvent<MovedData> & {
  type: 'Moved';
}
