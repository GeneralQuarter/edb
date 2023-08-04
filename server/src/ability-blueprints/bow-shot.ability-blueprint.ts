import { bumpStat } from '../lib/ability';
import { roll100 } from '../lib/random';
import type { AbilityBlueprint } from '../types/ability-blueprint';
import type { AbilityMissedGameEvent } from '../types/game-events/ability-missed.game-event';
import type { EntityDamageGameEvent } from '../types/game-events/entity-damage.game-event';

export default {
  name: 'Shoot!',
  reach: {shape: 'Diamond', size: 15},
  impact: 'Origin',
  cast(_, eventBus, caster, hitEntities) {
    const hitEntity = hitEntities[0];

    if (!hitEntity || roll100() > caster.hitChance) {
      eventBus.dispatch<AbilityMissedGameEvent>('AbilityMissed', {
        entityId: caster.id,
        abilityId: 'BowShot'
      });
      return;
    }

    eventBus.dispatch<EntityDamageGameEvent>('EntityDamage', {
      entityId: hitEntity.id,
      damage: caster.damage + 5,
    });

    bumpStat(eventBus, caster, 'hitChance', 4, 100);
    bumpStat(eventBus, caster, 'damage', 4, 75);
  },
} as AbilityBlueprint;
