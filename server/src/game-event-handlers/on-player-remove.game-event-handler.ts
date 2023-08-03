import SingleGameEventHandler from '../single-game-event-handler';
import type { RemovePlayerData, RemovePlayerGameEvent } from '../types/game-events/player-remove.game-event';

export default class OnPlayerRemoveGameEventHandler extends SingleGameEventHandler<RemovePlayerGameEvent> {
  handle(data: RemovePlayerData): void {
    this.game.removePlayer(data.token);
  }
}
