import { roll } from '../lib/random';
import type { EntityBlueprint } from '../types/entity-blueprint';
import type { NextTurnEvent } from '../types/game-events/next-turn.game-event';

export default {
  playable: false,
  abilities: [],
  generateStats: () => ({
    health: 50 + roll(20),
    initiative: 70,
    resistance: 0,
    movement: 5,
    damage: 5,
    hitChance: 0,
  }),
  async playTurn(self, game, eventBus) {
    eventBus.dispatch<NextTurnEvent>('NextTurn', {});
  },
} as EntityBlueprint;
