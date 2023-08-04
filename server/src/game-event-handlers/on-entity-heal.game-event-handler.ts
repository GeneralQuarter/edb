import { bumpStat } from '../lib/ability';
import SingleGameEventHandler from '../single-game-event-handler';
import { EntityHealData, EntityHealGameEvent } from '../types/game-events/entity-heal.game-event';

export default class OnEntityHealGameEventHandler extends SingleGameEventHandler<EntityHealGameEvent> {
  handle({ entityId, heal }: EntityHealData): void {
    const entity = this.getEntity(entityId);
    bumpStat(this.eventBus, entity, 'health', heal, entity.maxHealth);
  }
}
