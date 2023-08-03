import EventBus from '../event-bus';
import type { Entity } from '../types/entity';
import type { EntityStats } from '../types/entity-stats';
import type { EntityStatChangedGameEvent } from '../types/game-events/entity-stat-changed.game-event';

export function bumpStat(eventBus: EventBus, entity: Entity, stat: keyof EntityStats, amount: number, max: number) {
  const from = entity[stat];
  const to = Math.max(from + amount, max);

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
