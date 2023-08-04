import EventBus from '../event-bus';
import type { Entity } from '../types/entity';
import type { EntityStats } from '../types/entity-stats';
import type { EntityStatChangedGameEvent } from '../types/game-events/entity-stat-changed.game-event';

export function bumpStat(eventBus: EventBus, entity: Entity, stat: keyof EntityStats, amount: number, max: number) {
  const from = entity[stat];
  const to = Math.min(from + amount, max);

  changeStat(eventBus, entity, stat, from, to);
}

export function decreaseStat(eventBus: EventBus, entity: Entity, stat: keyof EntityStats, amount: number, min: number = 0) {
  const from = entity[stat];
  const to = Math.max(from - amount, min);

  changeStat(eventBus, entity, stat, from, to);
}

export function changeStat(eventBus: EventBus, entity: Entity, stat: keyof EntityStats, from: number, to: number) {
  if (from === to) {
    return;
  }

  entity[stat] = to;

  eventBus.dispatch<EntityStatChangedGameEvent>('EntityStatChanged', {
    entityId: entity.id,
    stat,
    from,
    to,
  });
}
