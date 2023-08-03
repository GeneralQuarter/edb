import type { GameEvent } from '../game-event';

export type PlayerConnectData = {
  token: string;
  username: string;
}

export type PlayerConnectEvent = GameEvent<PlayerConnectData> & {
  type: 'PlayerConnect';
}
