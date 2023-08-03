import EventBus from './event-bus';
import Game from './game';
import type { GameEvent } from './types/game-event';

export default abstract class GameEventHandler {
  public name: string;
  public eventTypes: string[];
  protected game: Game;
  protected eventBus: EventBus;

  constructor(name: string, eventTypes: string[], game: Game, eventBus: EventBus) {
    this.name = name;
    this.eventTypes = eventTypes;
    this.game = game;
    this.eventBus = eventBus;
  }

  abstract handle(event: GameEvent<any>): void;

  protected log(message: string) {
    console.log(`[${this.name}] ${message}`);
  }
}
