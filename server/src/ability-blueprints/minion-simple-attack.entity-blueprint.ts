import type { AbilityBlueprint } from '../types/ability-blueprint';
import type { EntityDamageGameEvent } from '../types/game-events/entity-damage.game-event';

export default {
  name: 'Take that!',
  reach: {
    shape: 'Diamond',
    size: 3,
  },
  impact: 'Origin',
  cast(_, eventBus, caster, hitEntities) {
    const hitEntity = hitEntities[0];

    if (!hitEntity) {
      return;
    }

    eventBus.dispatch<EntityDamageGameEvent>('EntityDamage', {
      entityId: hitEntity.id,
      damage: caster.damage + 5,
    });
  },
} as AbilityBlueprint;
