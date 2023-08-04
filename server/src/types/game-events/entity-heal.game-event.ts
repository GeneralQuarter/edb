import type { GameEvent } from '../game-event';

export type EntityHealData = {
  entityId: number;
  heal: number;
};

export type EntityHealGameEvent = GameEvent<EntityHealData> & {
  type: 'EntityHeal';
}
