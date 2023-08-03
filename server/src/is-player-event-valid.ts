import { GameEvent } from './types/game-event';

const allowedPlayerEventTypes = [
  'CharacterSelect',
  'StartGame',
  'NextTurn',
  'Move',
];

export default function isPlayerEventValid(event: GameEvent<any>) {
  return allowedPlayerEventTypes.includes(event.type);
}
