import { Component, For, Index, createMemo, type JSX } from 'solid-js';
import './Notifier.css';
import { useNotifications } from '../contexts/notifications';
import { useGame } from '../contexts/game';
import { TilePosition } from '../types/tile-position';
import { toTilePosition } from '../lib/board';

type Props = {
  tileSize: number;
}

const Notifier: Component<Props> = (props) => {
  const [clusters] = useNotifications();
  const [{ game }] = useGame();

  const width = () => {
    return game?.map.width ?? 1;
  }

  const height = () => {
    return game?.map.height ?? 1;
  }

  const containerStyle = (): JSX.CSSProperties => {
    return {
      width: `${width() * props.tileSize}px`,
      height: `${height() * props.tileSize}px`,
    }
  }

  const healthBars = createMemo(() => {
    const playerEntityIds = game?.players.map(p => p.entityId).filter(n => !!n) as number[] ?? [];
    return game?.entities.filter(e => !playerEntityIds.includes(e.id)).map(e => ({
      percent: (e.health * 100) / e.maxHealth,
      position: toTilePosition(game.map.entityTiles.findIndex(t => e.id === t), game.map.width),
    })) ?? [];
  });

  const clusterStyle = (at: TilePosition): JSX.CSSProperties => {
    return {
      bottom: `${(height() - at.y) * props.tileSize}px`,
      left: `${at.x * props.tileSize}px`,
    }
  }

  return <div class='notifier-container' style={containerStyle()}>
    <Index each={healthBars()}>{(healthBar) => 
      <div class='health-bar-container' style={clusterStyle(healthBar().position)}>
          <div class='health-indicator' style={{width: `${healthBar().percent}%`}}></div>
      </div>
    }</Index>
    <Index each={clusters()}>{(cluster) => 
      <div class='notification-cluster' style={clusterStyle(cluster().at)}>
        <Index each={cluster().notifications}>{(notification) => 
          <div class='notification'>{notification().text}</div>
        }</Index>
      </div>
    }</Index>
  </div>
}

export default Notifier;
