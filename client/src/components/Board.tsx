import { type Component, onMount, onCleanup, For } from 'solid-js';
import { useGame } from '../contexts/game';
import { isTileInMap, toTilePosition } from '../lib/board';
import './Board.css';
import { drawBackground, drawGrid, drawImage, drawShape } from '../lib/draw';
import { TilePosition } from '../types/tile-position';

type Props = {
  reachTiles: TilePosition[];
  onClick: (mouseTile: TilePosition) => void;
}

const Board: Component<Props> = (props) => {
  const [{ game }] = useGame();
  let canvas: HTMLCanvasElement | undefined;
  let spritesByEntityType: Record<string, HTMLImageElement | undefined> = {};

  const tileSize = 40;

  const entities = () => {
    if (!game) {
      return [];
    }

    return game.entities.map(e => ({
      id: e.id,
      type: e.type,
      ...toTilePosition(game.map.entityTiles.findIndex(id => id === e.id), game.map.width)
    }));
  }

  const playedEntityTypes = () => {
    if (!game) {
      return [];
    }

    return game.entities.map(e => e.type);
  }

  const width = () => {
    return game?.map.width ?? 1;
  }

  const height = () => {
    return game?.map.height ?? 1;
  }

  onMount(() => {
    if (!canvas) return;

    const w = canvas.width;
    const h = canvas.height;

    const ctx = canvas.getContext('2d')!;
    let frame = requestAnimationFrame(loop);

    function loop(t: DOMHighResTimeStamp) {
      frame = requestAnimationFrame(loop);

      ctx.clearRect(0, 0, w, h);
      drawBackground(ctx, w, h);
      drawGrid(ctx, w, h, tileSize);

      for (const entity of entities()) {
        const image = spritesByEntityType[entity.type];

        if (!image) {
          continue;
        }

        drawImage(ctx, image, entity, tileSize, 2);
      }

      drawShape(ctx, props.reachTiles, tileSize);
    }

    onCleanup(() => cancelAnimationFrame(frame));
  });

  const getMouseTilePosition = (evt: MouseEvent): TilePosition => {
    if (!canvas) {
      return {x: 0, y: 0};
    }

    const gx = evt.clientX - canvas.offsetLeft;
    const gy = evt.clientY - canvas.offsetTop;
    return {x: Math.floor(gx / tileSize), y: Math.floor(gy / tileSize)};
  }

  const canvasClicked = (evt: MouseEvent) => {
    const mouseTile = getMouseTilePosition(evt);

    if (!isTileInMap(mouseTile, width(), height())) {
      return;
    }

    props.onClick(mouseTile);
  }

  return <>
    <For each={playedEntityTypes()}>{entityType => 
      <img ref={spritesByEntityType[entityType]} src={`/images/${entityType.toLowerCase()}.gif`} class="resource-image" />
    }</For>
    <canvas ref={canvas} width={width() * tileSize} height={height() * tileSize} onClick={evt => canvasClicked(evt)} />
  </>;
}

export default Board;
