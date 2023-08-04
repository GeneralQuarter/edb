import EventBus from '../event-bus';
import Game from '../game';
import { computeOptimalAbilityTarget, moveTowardsClosestPlayer } from '../lib/ai';
import { roll } from '../lib/random';
import { delay } from '../lib/timer';
import type { Entity } from '../types/entity';
import type { EntityBlueprint } from '../types/entity-blueprint';
import type { CastAbilityGameEvent } from '../types/game-events/cast-ability.game-event';
import type { NextTurnEvent } from '../types/game-events/next-turn.game-event';

export default {
  playable: false,
  abilityIds: [
    'MinionBossHeal',
    'MinionSimpleAttack',
  ],
  generateStats: () => ({
    health: 50 + roll(20),
    initiative: 70,
    resistance: 0,
    movement: 5,
    damage: 5,
    hitChance: 0,
  }),
  async playTurn(self, game, eventBus) {
    await moveTowardsClosestPlayer(self, game, eventBus);

    const actions = [tryHealBoss, tryDamagePlayers];

    for (const action of actions) {
      if (action(self, game, eventBus)) {
        break;
      }
    }

    await delay(500);
    eventBus.dispatch<NextTurnEvent>('NextTurn', {});
  },
} as EntityBlueprint;

function tryHealBoss(self: Entity, game: Game, eventBus: EventBus): boolean {
  const bosses = game.getEntitiesOfType('Boss');
  const boss = bosses[0];

  if (!boss) {
    return false;
  }

  if (boss.health >= 100) {
    return false;
  }

  const bossPosition = game.map.getEntityTilePosition(boss.id);

  if (!bossPosition) {
    return false;
  }

  eventBus.dispatch<CastAbilityGameEvent>('CastAbility', {
    entityId: self.id,
    abilityId: 'MinionBossHeal',
    target: bossPosition,
  });

  return true;
}

function tryDamagePlayers(self: Entity, game: Game, eventBus: EventBus): boolean {
  const result = computeOptimalAbilityTarget(self, 'MinionSimpleAttack', game);

  if (!result || result.targetCount === 0) {
    return false;
  }

  eventBus.dispatch<CastAbilityGameEvent>('CastAbility', {
    entityId: self.id,
    abilityId: 'MinionSimpleAttack',
    target: result.target,
  });

  return true;
}
