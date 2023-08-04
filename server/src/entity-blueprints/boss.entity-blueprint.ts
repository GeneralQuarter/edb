import { computeOptimalAbilityTarget, moveTowardsClosestPlayer } from '../lib/ai';
import { roll } from '../lib/random';
import { delay } from '../lib/timer';
import type { EntityBlueprint } from '../types/entity-blueprint';
import type { CastAbilityGameEvent } from '../types/game-events/cast-ability.game-event';
import type { NextTurnEvent } from '../types/game-events/next-turn.game-event';

export default {
  playable: false,
  abilityIds: [
    'NovaLightning',
    'NovaStrike',
  ],
  generateStats: () => ({
    health: 300 + roll(100),
    initiative: 90,
    resistance: 0,
    movement: 3,
    damage: 10 + roll(5),
    hitChance: 0,
  }),
  async playTurn(self, game, eventBus) {
    const strikeResult = computeOptimalAbilityTarget(self, 'NovaStrike', game);
    const lightningResult = computeOptimalAbilityTarget(self, 'NovaLightning', game);

    const strikeTargetCount = strikeResult?.targetCount ?? 0;
    const lightningTargetCount = lightningResult?.targetCount ?? 0;
    const shouldMove = strikeTargetCount <= 1 && lightningTargetCount === 0;

    if (shouldMove) {
      await moveTowardsClosestPlayer(self, game, eventBus);
    }

    const strikeResult2 = shouldMove ? computeOptimalAbilityTarget(self, 'NovaStrike', game) : strikeResult;
    const lightningResult2 = shouldMove ? computeOptimalAbilityTarget(self, 'NovaLightning', game) : lightningResult;

    if (strikeResult2 && strikeResult2.targetCount > 0) {
      eventBus.dispatch<CastAbilityGameEvent>('CastAbility', {
        entityId: self.id,
        abilityId: 'NovaStrike',
      });
    } else if (lightningResult2 && lightningResult2.targetCount > 0) {
      eventBus.dispatch<CastAbilityGameEvent>('CastAbility', {
        entityId: self.id,
        abilityId: 'NovaLightning',
        target: lightningResult2.target,
      });
    }

    await delay(500);
    eventBus.dispatch<NextTurnEvent>('NextTurn', {});
  },
} as EntityBlueprint;
