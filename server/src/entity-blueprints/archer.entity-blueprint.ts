import { bumpStat } from '../lib/ability';
import { roll, roll100 } from '../lib/random';
import { AbilityBlueprint } from '../types/ability-blueprint';
import type { EntityBlueprint } from '../types/entity-blueprint';
import type { EntityDamageGameEvent } from '../types/game-events/entity-damage.game-event';

const getGudAbility: AbilityBlueprint = {
  name: 'Get gud',
  impact: 'Origin',
  cast(_, eventBus, caster) {
    bumpStat(eventBus, caster, 'hitChance', 7, 100);
    bumpStat(eventBus, caster, 'damage', 10, 100);
  }
};

const shootAbility: AbilityBlueprint = {
  name: 'Shoot!',
  reach: {shape: 'Diamond', size: 15},
  impact: 'Origin',
  cast(game, eventBus, caster, target) {
    const targetEntityId = game.map.getEntityIdAtPosition(target);

    if (!targetEntityId) {
      return;
    }

    if (roll100() > caster.hitChance) {
      return;
    }

    eventBus.dispatch<EntityDamageGameEvent>('EntityDamage', {
      entityId: targetEntityId,
      damage: caster.damage + 5,
    });

    bumpStat(eventBus, caster, 'hitChance', 4, 100);
    bumpStat(eventBus, caster, 'damage', 4, 75);
  },
}

export default {
  playable: true,
  abilities: [
    getGudAbility,
    shootAbility,
  ],
  generateStats: () => ({
    health: 100 + roll(20),
    initiative: 70 + roll(20),
    resistance: 1,
    movement: 4,
    damage: 25 + roll(10),
    hitChance: 60,
  }),
} as EntityBlueprint;
