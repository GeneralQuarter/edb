import SingleGameEventHandler from '../single-game-event-handler';
import type { RemovePlayerGameEvent } from '../types/game-events/player-remove.game-event';
import type { PlayerDisconnectData, PlayerDisconnectEvent } from '../types/game-events/player-disconnect.game-event';

export default class OnPlayerDisconnectGameEventHandler extends SingleGameEventHandler<PlayerDisconnectEvent> {
  handle({token}: PlayerDisconnectData): void {
    const player = this.game.getPlayerWithToken(token);

    if (!player) {
      return;
    }

    this.log(`Player ${player.username} (${token}) disconnected`);
    player.connected = false;

    player.disconnectTimeout = setTimeout(() => {
      this.eventBus.dispatch<RemovePlayerGameEvent>('PlayerRemove', {
        token: player.token,
      });
    }, 30000);
  }
}
