import EventBus from './event-bus';
import Game from './game';
import GameEventHandler from './game-event-handler';
import type { GameEvent } from './types/game-event';

export default abstract class SingleGameEventHandler<T extends GameEvent<any>> extends GameEventHandler {
  constructor(name: string, eventType: string, game: Game, eventBus: EventBus) {
    super(name, [eventType], game, eventBus);
  }

  abstract handle(data: T['data']): void;
}
