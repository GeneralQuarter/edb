import Game from './game';
import EventBus from './event-bus';
import { Server } from 'socket.io';
import type { PlayerConnectEvent } from './types/game-events/player-connect.game-event';
import type { PlayerDisconnectEvent } from './types/game-events/player-disconnect.game-event';
import type { GameEvent } from './types/game-event';
import isPlayerEventValid from './is-player-event-valid';
import isEventBroadcastable from './is-event-broadcastable';
import type { EntityBlueprint } from './types/entity-blueprint';
import type { TileShape } from './types/tile-shape';
import type { AbilityBlueprint } from './types/ability-blueprint';
import { load, save } from './lib/persistance';
import { loadModulesInFolder } from './lib/folder-modules';
import GameEventHandler from './game-event-handler';
import socketGameAuth from './lib/socket-game-auth';

const PORT = 3001;

function log(message: string) {
  console.log(`[Startup] ${message}`);
}

async function startup(io: Server) {
  const game = new Game();
  const eventBus = new EventBus((event: GameEvent<any>) => {
    if (!isEventBroadcastable(event)) {
      return;
    }

    io.emit('server_event', event);
  });

  const eventHandlerModules = await loadModulesInFolder<typeof GameEventHandler>('game-event-handlers');

  for (const [handlerName, GameEventHandler] of Object.entries(eventHandlerModules)) {
    // @ts-ignore
    eventBus.addHandler(new GameEventHandler(handlerName, handlerName.replace('On', ''), game, eventBus));
  }

  game.tileShapeByShapeType = await loadModulesInFolder<TileShape>('tile-shapes');
  game.abilityBlueprintByAbilityId = await loadModulesInFolder<AbilityBlueprint>('ability-blueprints');
  game.entityBlueprintByEntityType = await loadModulesInFolder<EntityBlueprint>('entity-blueprints');

  const playableEntityTypes: string[] = Object.entries(game.entityBlueprintByEntityType).filter(([, eb]) => eb.playable).map(([entityType,]) => entityType);
  game.entityTypes = playableEntityTypes;
  log(`Playable entity types: ${playableEntityTypes.join(', ')}`);

  await load(game);

  io.use(socketGameAuth(game));

  io.on('connection', (socket) => {
    eventBus.dispatch<PlayerConnectEvent>('PlayerConnect', {
      username: socket.handshake.auth.username,
      token: socket.handshake.auth.token,
    });

    socket.on('player_event', (event: GameEvent<any>) => {
      if (!isPlayerEventValid(event)) {
        return;
      }

      eventBus.dispatch(event.type, {...event.data, playerToken: socket.handshake.auth.token});
    });

    socket.on('disconnect', () => {
      eventBus.dispatch<PlayerDisconnectEvent>('PlayerDisconnect', {
        token: socket.handshake.auth.token,
      });
    });
  });

  setInterval(() => {
    io.emit('game_state', game.toState());
  }, 1000);

  process.once('SIGINT', async () => {
    await save(game);
    process.kill(process.pid, 'SIGINT');
  });
}

const io = new Server({
  cors: {origin: 'http://localhost:3000'},
});

(async () => {
  try {
    await startup(io);
    log(`Server started`);
  } catch (e) {
    console.log(e);
  }
})();

io.listen(PORT);
log(`Listening on ${PORT}...`);
