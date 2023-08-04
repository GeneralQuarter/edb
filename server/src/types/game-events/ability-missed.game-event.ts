import type { GameEvent } from '../game-event';
import { TilePosition } from '../tile-position';

export type AbilityMissedData = {
  entityId: number;
  abilityId: string;
  target?: TilePosition;
};

export type AbilityMissedGameEvent = GameEvent<AbilityMissedData> & {
  type: 'AbilityMissed';
}
