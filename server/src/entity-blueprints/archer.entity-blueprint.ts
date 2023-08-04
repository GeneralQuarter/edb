import { roll } from '../lib/random';
import type { EntityBlueprint } from '../types/entity-blueprint';

export default {
  playable: true,
  abilityIds: [
    'GetGud',
    'BowShot',
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
