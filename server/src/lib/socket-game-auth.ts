import { Socket } from 'socket.io';
import Game from '../game';
import { dateLog } from './logger';

export default function socketGameAuth(game: Game) {
  return (socket: Socket, next: (err?: Error) => void) => {
    const {username, token} = socket.handshake.auth;

    if (!username || !token) {
      return next(new Error('MissingAuth'));
    }

    dateLog(`Connection request from ${username} (${token})`);

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
  }
}
