import GameEventHandler from './game-event-handler';
import { dateLog } from './lib/logger';
import type { GameEvent } from './types/game-event';
import colors from 'colors/safe';

export default class EventBus {
  private globalHandler: (event: GameEvent<any>) => void;
  private handlers: GameEventHandler[];
  private queue: GameEvent<any>[];
  private dispatchTimeout?: NodeJS.Timeout;

  constructor(globalHandler: (event: GameEvent<any>) => void) {
    this.handlers = [];
    this.queue = [];
    this.globalHandler = globalHandler;
  }

  public addHandler(handler: GameEventHandler) {
    this.handlers.push(handler);
  }

  public dispatch<T extends GameEvent<any>>(type: T['type'], data: T['data']) {
    const event = {type, data};
    this.log(`Dispatch ${colors.green(type)} ${colors.gray(JSON.stringify(data))}`);
    this.queue.unshift(event);

    clearTimeout(this.dispatchTimeout);
    this.dispatchTimeout = setTimeout(() => {
      this.handleNextEvent();
    }, 1);
  }

  public handleNextEvent() {
    const event = this.queue.pop();

    if (!event) {
      return;
    }

    this.handleEvent(event.type, event.data)
      .finally(() => {
        this.handleNextEvent();
      });
  }

  public async handleEvent<T extends GameEvent<any>>(type: T['type'], data: T['data']) {
    const handlers = this.handlers.filter(h => h.eventTypes.includes(type));

    for (const handler of handlers) {
      try {
        dateLog(`Handle   ${colors.green(type)} ${colors.gray(JSON.stringify(data))}`);
        await handler.handle(handler.eventTypes.length === 1 ? data : {type, data});
      } catch (e) {
        dateLog(e as string);
      }
    }

    this.globalHandler({type, data});
  }

  private log(message: string) {
    dateLog(message);
  }
}
