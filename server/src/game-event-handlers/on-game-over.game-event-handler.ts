import SingleGameEventHandler from '../single-game-event-handler';
import type { GameOverData, GameOverGameEvent } from '../types/game-events/game-over.game-event';

export default class OnGameOverGameEventHandler extends SingleGameEventHandler<GameOverGameEvent> {
  handle(_: GameOverData): void {
    this.game.returnToLobby();
  }
}
