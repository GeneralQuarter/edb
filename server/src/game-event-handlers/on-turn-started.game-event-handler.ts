import SingleGameEventHandler from '../single-game-event-handler';
import type { NextTurnEvent } from '../types/game-events/next-turn.game-event';
import type { TurnStartedData, TurnStartedGameEvent } from '../types/game-events/turn-started.game-event';

export default class OnTurnStartedGameEventHandler extends SingleGameEventHandler<TurnStartedGameEvent> {
  async handle({ entityId }: TurnStartedData): Promise<void> {
    const entity = this.getEntity(entityId);

    if (this.game.isEntityPlayerControlled(entityId)) {
      return;
    }

    const entityBlueprint = this.game.entityBlueprintByEntityType[entity.type];

    if (!entityBlueprint.playTurn) {
      this.eventBus.dispatch<NextTurnEvent>('NextTurn', {});
      return;
    }

    await entityBlueprint.playTurn(entity, this.game, this.eventBus);
  }
}
