import { bumpStat } from '../lib/ability';
import type { AbilityBlueprint } from '../types/ability-blueprint';
import { EntityDamageGameEvent } from '../types/game-events/entity-damage.game-event';

export default {
  name: 'Nova Strike',
  impact: {
    shape: 'Diamond',
    size: 3,
  },
  cast(_, eventBus, caster, hitEntities) {
    for (const hitEntity of hitEntities) {
      eventBus.dispatch<EntityDamageGameEvent>('EntityDamage', {
        entityId: hitEntity.id,
        damage: caster.damage + 10,
      });
    }

    bumpStat(eventBus, caster, 'resistance', 1, 15);
  },
} as AbilityBlueprint;
