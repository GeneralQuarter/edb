import { bumpStat } from '../lib/ability';
import SingleGameEventHandler from '../single-game-event-handler';
import type { NextTurnData, NextTurnEvent } from '../types/game-events/next-turn.game-event';
import type { TurnStartedGameEvent } from '../types/game-events/turn-started.game-event';

export default class OnNextTurnGameEventHandler extends SingleGameEventHandler<NextTurnEvent> {
  handle({ playerToken }: NextTurnData): void {
    if (this.game.state !== 'Game') {
      return;
    }

    const player = this.game.getPlayerWithToken(playerToken ?? '');

    if (player && player.entityId) {
      this.validateEntityTurn(player.entityId);
    }

    const entityTurnOrder = this.game.entities.sort((a, b) => b.initiative - a.initiative).map(e => e.id);
    const currentIndex = entityTurnOrder.indexOf(this.game.turnEntityId ?? -1);
    this.game.turnEntityId = entityTurnOrder[(currentIndex + 1) % entityTurnOrder.length];

    const entity = this.getEntity(this.game.turnEntityId);

    bumpStat(this.eventBus, entity, 'movement', entity.initialMovement, entity.initialMovement);

    this.eventBus.dispatch<TurnStartedGameEvent>('TurnStarted', {
      entityId: this.game.turnEntityId
    });
  }
}
