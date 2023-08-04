import { decreaseStat } from '../lib/ability';
import SingleGameEventHandler from '../single-game-event-handler';
import type { EntityDamageData, EntityDamageGameEvent } from '../types/game-events/entity-damage.game-event';

export default class OnEntityDamageGameEventHandler extends SingleGameEventHandler<EntityDamageGameEvent> {
  handle({ entityId, damage, bypassArmor }: EntityDamageData): void {
    const target = this.getEntity(entityId);
    decreaseStat(this.eventBus, target, 'health', damage - (bypassArmor ? 0 : target.resistance));
  }
}
