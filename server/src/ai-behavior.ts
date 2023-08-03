import EventBus from './event-bus';
import Game from './game';

export default abstract class AIBehavior {
  public entityId: number;
  public game: Game;
  public eventBus: EventBus;

  constructor(entityId: number, game: Game, eventBus: EventBus) {
    this.entityId = entityId;
    this.game = game;
    this.eventBus = eventBus;
  }

  abstract playTurn(): Promise<void>;

  log(message: string) {
    console.log(`[AIBehavior] ${message}`);
  }
}
