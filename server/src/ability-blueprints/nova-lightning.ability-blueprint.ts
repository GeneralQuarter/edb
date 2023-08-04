import { bumpStat } from "../lib/ability";
import { AbilityBlueprint } from "../types/ability-blueprint";
import { EntityDamageGameEvent } from "../types/game-events/entity-damage.game-event";

export default {
  name: 'Nova Lightning',
  reach: {
    shape: 'Diamond',
    size: 6,
  },
  impact: {
    shape: 'Diamond',
    size: 2,
  },
  cast(_, eventBus, caster, hitEntities) {
    for (const hitEntity of hitEntities) {
      eventBus.dispatch<EntityDamageGameEvent>('EntityDamage', {
        entityId: hitEntity.id,
        damage: caster.damage + 5,
      });
    }

    bumpStat(eventBus, caster, 'damage', hitEntities.length * 2, 35);
  },
} as AbilityBlueprint;
