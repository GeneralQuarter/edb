import type { GameEvent } from '../game-event';

export type EntityDeathData = {
  entityId: number;
};

export type EntityDeathGameEvent = GameEvent<EntityDeathData> & {
  type: 'EntityDeath';
}
