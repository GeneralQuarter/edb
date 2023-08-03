import SingleGameEventHandler from '../single-game-event-handler';
import type { PlayerConnectData, PlayerConnectEvent } from '../types/game-events/player-connect.game-event';

export default class OnPlayerConnectGameEventHandler extends SingleGameEventHandler<PlayerConnectEvent> {
  handle({token, username}: PlayerConnectData): void {
    const player = this.game.getPlayerWithToken(token);

    if (player) {
      this.log(`Player ${username} (${token}) reconnected`);
      player.connected = true;
      
      if (player.disconnectTimeout) {
        clearTimeout(player.disconnectTimeout);
      }
      return;
    }

    this.log(`Player ${username} (${token}) connected`);
    this.game.addPlayer({
      connected: true,
      token,
      username,
    });
  }
}
