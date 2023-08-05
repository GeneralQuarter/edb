import { Component, For, Index, type JSX } from 'solid-js';
import './Notifier.css';
import { useNotifications } from '../contexts/notifications';
import { useGame } from '../contexts/game';
import { TilePosition } from '../types/tile-position';

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

  const clusterStyle = (at: TilePosition): JSX.CSSProperties => {
    return {
      bottom: `${(height() - at.y) * props.tileSize}px`,
      left: `${at.x * props.tileSize}px`,
    }
  }

  return <div class='notifier-container' style={containerStyle()}>
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
