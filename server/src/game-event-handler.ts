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

  abstract handle(event: GameEvent<any>): Promise<void>;

  protected log(message: string) {
    console.log(`[${this.name}] ${message}`);
  }

  protected getEntity(entityId: number) {
    const entity = this.game.getEntity(entityId);

    if (!entity) {
      throw Error(`Could not find entity ${entityId}`);
    }

    return entity;
  }

  protected validateEntityTurn(entityId: number) {
    if (this.game.turnEntityId !== entityId) {
      throw new Error(`Not the turn of ${entityId} (currently ${this.game.turnEntityId})`);
    }
  }

  protected validateEntityControlledByPlayer(entityId: number, playerToken?: string) {
    if (playerToken && !this.game.isEntityControlledByPlayer(entityId, playerToken)) {
      throw new Error(`Player ${playerToken} does not control entity ${entityId}`);
    }
  }
}
