import { readdir, writeFile, readFile } from 'fs/promises';
import { join } from 'path';
import Game from './game';
import EventBus from './event-bus';
import { Server } from 'socket.io';
import type { PlayerConnectEvent } from './types/game-events/player-connect.game-event';
import type { PlayerDisconnectEvent } from './types/game-events/player-disconnect.game-event';
import type { GameEvent } from './types/game-event';
import isPlayerEventValid from './is-player-event-valid';
import isEventBroadcastable from './is-event-broadcastable';
import type { EntityBlueprint } from './types/entity-blueprint';
import { TileShape } from './types/tile-shape';
import { AbilityBlueprint } from './types/ability-blueprint';
import { pascalCase } from './lib/pascal-case';

const PORT = 3001;

async function loadFolderModules<T>(folderName: string): Promise<[string, T][]> {
  const filenames = (await readdir(join(__dirname, folderName))).filter(f => f.endsWith('.js'));
  const filenameAndModules: [string, T][]  = [];

  for (const filename of filenames) {
    const mod = (await import(`./${folderName}/${filename}`)).default.default as T;
    filenameAndModules.push([filename, mod]);
  }

  return filenameAndModules;
}

async function loadFolderModulesByType<T>(folderName: string, typeName: string) {
  const moduleByType: Record<string, T> = {};
  const modules = await loadFolderModules<T>(folderName);

  for (const [filename, module] of modules) {
    const shapeType = pascalCase(filename.split('.')[0]);
    moduleByType[shapeType] = module;
    log(`Loaded ${shapeType}${typeName}`);
  }

  return moduleByType;
}

async function saveGame(game: Game) {
  await writeFile(join(__dirname, 'save.json'), JSON.stringify(game.toServerState(), null, 2), 'utf-8');
}

async function loadSave() {
  let json;

  try {
    json = await readFile(join(__dirname, 'save.json'), 'utf-8');
  } catch (e) {}

  if (!json) {
    return null;
  }

  let save = null;

  try {
    save = JSON.parse(json);
  } catch (e) {}

  return save;
}

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
  const eventHandlerModules = await loadFolderModules<any>('game-event-handlers');

  for (const [eventHandlerFilename, GameEventHandler] of eventHandlerModules) {
    const handlerName = pascalCase(eventHandlerFilename.replace(/\.js$/, ''));
    const eventType = handlerName.startsWith('On') ? handlerName.replace('On', '').replace('GameEventHandler', '') : null;
    eventBus.addHandler(eventType ? new GameEventHandler(handlerName, eventType, game, eventBus) : new GameEventHandler(handlerName, game, eventBus));
    log(`Loaded ${handlerName}`);
  }

  game.tileShapeByShapeType = await loadFolderModulesByType<TileShape>('tile-shapes', 'TileShape');
  game.abilityBlueprintByAbilityId = await loadFolderModulesByType<AbilityBlueprint>('ability-blueprints', 'AbilityBlueprint');
  game.entityBlueprintByEntityType = await loadFolderModulesByType<EntityBlueprint>('entity-blueprints', 'EntityBlueprint');
  const playableEntityTypes: string[] = Object.entries(game.entityBlueprintByEntityType).filter(([, eb]) => eb.playable).map(([entityType,]) => entityType);
  game.entityTypes = playableEntityTypes;
  log(`Playable entity types: ${playableEntityTypes.join(', ')}`);

  // const save = await loadSave();

  // if (save) {
  //   log('Restoring from save...');
  //   game.restoreFromSave(save);
  // }

  io.use((socket, next) => {
    const {username, token} = socket.handshake.auth;

    if (!username || !token) {
      return next(new Error('MissingAuth'));
    }

    console.log(`[Socket.IO] Connection request from ${username} (${token})`);

    const existingPlayerWithUsername = game.getPlayerWithUsername(username);

    if (existingPlayerWithUsername && token !== existingPlayerWithUsername.token) {
      return next(new Error('UsernameTaken'));
    }

    const existingPlayer = game.getPlayerWithToken(token);

    if (existingPlayer && existingPlayer.connected) {
      return next(new Error('PlayerAlreadyConnected'));
    }

    if (!existingPlayer && game.state !== 'Lobby') {
      return next(new Error('GameInProgress'));
    }

    next();
  });

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
    console.log('Saving game...');
    await saveGame(game);
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
