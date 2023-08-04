import { AbilityBlueprint } from '../types/ability-blueprint';
import { EntityDamageGameEvent } from '../types/game-events/entity-damage.game-event';
import { EntityHealGameEvent } from '../types/game-events/entity-heal.game-event';

export default {
  name: 'Here master!',
  impact: 'Origin',
  cast(_, eventBus, caster, hitEntities) {
    const targetEntity = hitEntities[0];

    if (!targetEntity) {
      return;
    }

    eventBus.dispatch<EntityHealGameEvent>('EntityHeal', {
      entityId: targetEntity.id,
      heal: 15
    });
    eventBus.dispatch<EntityDamageGameEvent>('EntityDamage', {
      entityId: caster.id,
      damage: 10,
      bypassArmor: true,
    });
  },
} as AbilityBlueprint;
