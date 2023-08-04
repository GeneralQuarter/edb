import type { GameEvent } from '../game-event';
import { TilePosition } from '../tile-position';
import type { PlayerEventData } from './player-event-data';

export type CastAbilityData = {
  entityId: number;
  abilityId: string;
  target?: TilePosition;
} & PlayerEventData;

export type CastAbilityGameEvent = GameEvent<CastAbilityData> & {
  type: 'CastAbility';
}
