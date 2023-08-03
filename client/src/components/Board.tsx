import { type Component, onMount, onCleanup, For } from 'solid-js';
import { useGame } from '../contexts/game';
import { drawGrid, drawImage, toTilePosition } from '../lib/board';
import './Board.css';

const Board: Component = () => {
  const [{ game }] = useGame();
  let canvas: HTMLCanvasElement | undefined;
  let spritesByEntityType: Record<string, HTMLImageElement | undefined> = {};

  const tileSize = 40;

  const entities = () => {
    const _game = game();

    if (!_game) {
      return [];
    }

    return _game.entities.map(e => ({
      id: e.id,
      type: e.type,
      ...toTilePosition(_game.map.entityTiles.findIndex(id => id === e.id), _game.map.width)
    }));
  }

  const playedEntityTypes = () => {
    const _game = game();

    if (!_game) {
      return [];
    }

    return _game.entities.map(e => e.type);
  }

  const width = () => {
    return game()?.map.width ?? 1;
  }

  const height = () => {
    return game()?.map.height ?? 1;
  }

  onMount(() => {
    if (!canvas) return;

    const w = canvas.width;
    const h = canvas.height;

    const ctx = canvas.getContext('2d')!;
    let frame = requestAnimationFrame(loop);

    function loop(t: DOMHighResTimeStamp) {
      frame = requestAnimationFrame(loop);

      ctx.fillStyle = "rgba(114, 186, 80)";
      ctx.fillRect(0, 0, w, h);

      drawGrid(ctx, w, h, tileSize);

      for (const entity of entities()) {
        const image = spritesByEntityType[entity.type];

        if (!image) {
          continue;
        }

        drawImage(ctx, image, entity, tileSize, 2);
      }
    }

    onCleanup(() => cancelAnimationFrame(frame));
  });

  return <>
    <For each={playedEntityTypes()}>{entityType => 
      <img ref={spritesByEntityType[entityType]} src={`/images/${entityType.toLowerCase()}.gif`} class="resource-image" />
    }</For>
    <canvas ref={canvas} width={width() * tileSize} height={height() * tileSize} />
  </>;
}

export default Board;
