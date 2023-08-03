import SingleGameEventHandler from '../single-game-event-handler';
import type { NextTurnEvent } from '../types/game-events/next-turn.game-event';
import type { TurnStartedData, TurnStartedGameEvent } from '../types/game-events/turn-started.game-event';

export default class OnTurnStartedGameEventHandler extends SingleGameEventHandler<TurnStartedGameEvent> {
  handle({ entityId }: TurnStartedData): void {
    const entity = this.game.getEntity(entityId);

    if (!entity) {
      throw new Error(`Could not find entity ${entityId}`);
    }

    if (this.game.isEntityPlayerControlled(entityId)) {
      return;
    }

    const entityBlueprint = this.game.entityBlueprintByEntityType[entity.type];

    if (!entityBlueprint.playTurn) {
      this.eventBus.dispatch<NextTurnEvent>('NextTurn', {});
      return;
    }

    entityBlueprint.playTurn(entity, this.game, this.eventBus);
  }
}
