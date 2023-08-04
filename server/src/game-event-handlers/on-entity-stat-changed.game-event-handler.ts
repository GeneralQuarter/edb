import SingleGameEventHandler from '../single-game-event-handler';
import { EntityDeathGameEvent } from '../types/game-events/entity-death.game-event';
import { EntityStatChangedData, EntityStatChangedGameEvent } from '../types/game-events/entity-stat-changed.game-event';

export default class OnEntityStatChangedGameEventHandler extends SingleGameEventHandler<EntityStatChangedGameEvent> {
  handle({ entityId, to, stat }: EntityStatChangedData): void {
    if (stat === 'health' && to === 0) {
      this.eventBus.dispatch<EntityDeathGameEvent>('EntityDeath', { entityId });
    }
  }
}
