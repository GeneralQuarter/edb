import SingleGameEventHandler from '../single-game-event-handler';
import { EntityDeathData, EntityDeathGameEvent } from '../types/game-events/entity-death.game-event';
import { GameOverGameEvent } from '../types/game-events/game-over.game-event';
import { NextTurnEvent } from '../types/game-events/next-turn.game-event';

export default class OnEntityDeathGameEventHandler extends SingleGameEventHandler<EntityDeathGameEvent> {
  handle({ entityId }: EntityDeathData): void {
    this.game.removeEntity(entityId);

    const playerTiles = this.game.getPlayerTiles();

    if (playerTiles.length === 0 || this.game.entities.length === 1) {
      this.eventBus.dispatch<GameOverGameEvent>('GameOver', {});
      return;
    }

    if (this.game.turnEntityId === entityId) {
      this.eventBus.dispatch<NextTurnEvent>('NextTurn', {});
    }
  }
}
