import { bumpStat } from '../lib/ability';
import type { AbilityBlueprint } from '../types/ability-blueprint';

export default {
  name: 'Get gud',
  impact: 'Origin',
  cast(_, eventBus, caster) {
    bumpStat(eventBus, caster, 'hitChance', 7, 100);
    bumpStat(eventBus, caster, 'damage', 10, 100);
  }
} as AbilityBlueprint;
