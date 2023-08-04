import type { GameEvent } from '../game-event';

export type GameOverData = {};

export type GameOverGameEvent = GameEvent<GameOverData> & {
  type: 'GameOver';
}
