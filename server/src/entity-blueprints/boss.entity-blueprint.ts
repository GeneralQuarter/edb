import { roll } from '../lib/random';
import type { EntityBlueprint } from '../types/entity-blueprint';
import type { NextTurnEvent } from '../types/game-events/next-turn.game-event';

export default {
  playable: false,
  abilities: [],
  generateStats: () => ({
    health: 300 + roll(100),
    initiative: 90,
    resistance: 0,
    movement: 3,
    damage: 10 + roll(5),
    hitChance: 0,
  }),
  async playTurn(self, game, eventBus) {
    eventBus.dispatch<NextTurnEvent>('NextTurn', {});
  },
} as EntityBlueprint;
