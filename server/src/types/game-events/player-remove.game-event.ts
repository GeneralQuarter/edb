import type { GameEvent } from '../game-event';

export type RemovePlayerData = {
  token: string;
}

export type RemovePlayerGameEvent = GameEvent<RemovePlayerData> & {
  type: 'PlayerRemove';
}
