import { type Accessor, createContext, type Component, createSignal, type JSX, onMount, onCleanup, useContext } from 'solid-js';
import type { Game } from '../types/game';
import { io, type Socket } from 'socket.io-client';
import type { User } from '../types/user';
import type { Player } from '../types/player';
import type { GameEvent } from '../types/game-event';
import { toTileIndex } from '../lib/board';

type ContextValue = [
  {
    game: Accessor<Game | null>,
    player: Accessor<Player | null>,
  },
  {
    disconnect: () => void,
    sendEvent: (event: GameEvent<any>) => void,
  },
];

const GameContext = createContext<ContextValue>([
  {
    game: () => null,
    player: () => null,
  }, 
  {
    disconnect: () => {},
    sendEvent: () => {},
  }
]);

type Props = {
  user: User;
  children: JSX.Element;
}

const GameProvider: Component<Props> = (props) => {
  const [socket, setSocket] = createSignal<Socket | null>(null);
  const [game, setGame] = createSignal<Game | null>(null);

  onMount(() => {
    const s = io("localhost:3001", {
      auth: {
        username: props.user.username,
        token: props.user.token,
      }
    });

    s.on('connect', () => {
      console.log(s);
    });

    s.on('connect_error', (err) => {
      console.log(err);
    });

    s.on('server_event', (event) => {
      console.log(event);
      switch (event.type) {
        case 'Moved': {
          setGame(g => {
            if (!g) {
              return null;
            }

            const prevIndex = toTileIndex(event.data.from, g.map.width);
            const nextIndex = toTileIndex(event.data.to, g.map.width);

            const newEntityTiles = g.map.entityTiles.slice();
            newEntityTiles[prevIndex] = 0;
            newEntityTiles[nextIndex] = event.data.entityId;

            return {
              ...g,
              map: {
                ...g.map,
                entityTiles: newEntityTiles,
              },
            };
          });
        }
      }
    });

    s.on('game_state', (state: Game) => {
      setGame(state);
    });

    setSocket(s);
  });

  const disconnect = () => {
    const s = socket();

    if (s) {
      s.disconnect();
    }
    
    setSocket(null);
  };

  const sendEvent = (event: GameEvent<any>) => {
    const s = socket();

    if (s) {
      s.emit('player_event', event);
    }
  };

  onCleanup(() => {
    disconnect();
  });

  const player: Accessor<Player | null> = () => {
    const _game = game();

    if (!_game) {
      return null;
    }

    return _game.players.find(p => p.username === props.user.username) ?? null;
  };

  const value: ContextValue = [
    {
      game,
      player,
    },
    {
      disconnect,
      sendEvent,
    }
  ];

  return (
    <GameContext.Provider value={value}>
      {props.children}
    </GameContext.Provider>
  );
}

export default GameProvider;

export function useGame() { return useContext<ContextValue>(GameContext); }
