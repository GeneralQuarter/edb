import type { GameEvent } from '../game-event';

export type EntityDamageData = {
  entityId: number;
  damage: number;
  bypassArmor?: boolean;
};

export type EntityDamageGameEvent = GameEvent<EntityDamageData> & {
  type: 'EntityDamage';
}
