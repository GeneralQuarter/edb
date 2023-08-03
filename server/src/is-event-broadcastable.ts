import { GameEvent } from './types/game-event';

const broadcastableEventTypes = [
  'TurnStarted',
  'StatChanged',
  'Moved',
]

export default function isEventBroadcastable(event: GameEvent<any>) {
  return broadcastableEventTypes.includes(event.type);
}
