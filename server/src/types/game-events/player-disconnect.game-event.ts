import type { GameEvent } from '../game-event';

export type PlayerDisconnectData = {
  token: string;
}

export type PlayerDisconnectEvent = GameEvent<PlayerDisconnectData> & {
  type: 'PlayerDisconnect';
}
