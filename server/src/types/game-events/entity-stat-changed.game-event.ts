import { EntityStats } from '../entity-stats';
import type { GameEvent } from '../game-event';

export type EntityStatChangedData = {
  entityId: number;
  stat: keyof EntityStats;
  from: number;
  to: number;
};

export type EntityStatChangedGameEvent = GameEvent<EntityStatChangedData> & {
  type: 'EntityStatChanged';
}
