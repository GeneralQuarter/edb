import type { Map } from '../types/map';
import type { TilePosition } from '../types/tile-position';
import type { ShapeOptions, TileShape } from '../types/tile-shape';
import { TileShapeReference } from '../types/tile-shape-reference';
import { allTiles, isTileInMap, toTileIndex } from './board';

const allTileShape: TileShape = (origin: TilePosition, {map, includeOrigin}): TilePosition[] => {
  const shape = allTiles(map.height, map.width);

  if (!includeOrigin) {
    const originIndex = toTileIndex(origin, map.width);
    shape.splice(originIndex, 1);
  }

  return shape;
}

const crossTileShape: TileShape = (origin: TilePosition, {size = 1, includeOrigin}): TilePosition[] => {
  const shape: TilePosition[] = [];

  for (let i = 1; i <= size; i++) {
    shape.push({...origin, x: origin.x + i});
    shape.push({...origin, x: origin.x - i});
    shape.push({...origin, y: origin.y + i});
    shape.push({...origin, y: origin.y - i});
  }

  if (includeOrigin) {
    shape.push(origin);
  }

  return shape;
}

const diamondTileShape: TileShape = (origin: TilePosition, {size = 1, includeOrigin, map}): TilePosition[] => {
  const shape = crossTileShape(origin, {size, includeOrigin, map});

  if (size === 1) {
    return shape;
  }

  for (let i = 1; i < size; i++) {
    let k = i;

    for (let j = 1; j <= i; j++, k--) {
      shape.push({x: origin.x - k, y: origin.y + j});
      shape.push({x: origin.x + k, y: origin.y - j});
      shape.push({x: origin.x - k, y: origin.y - j});
      shape.push({x: origin.x + k, y: origin.y + j});
    }
  }

  return shape;
}

const originTileShape: TileShape = (origin: TilePosition): TilePosition[] => {
  return [origin];
}

const tileShapes: Record<string, TileShape> = {
  All: allTileShape,
  Cross: crossTileShape,
  Diamond: diamondTileShape,
  Origin: originTileShape,
}


export function computeShape(tileShapeReference: TileShapeReference, origin: TilePosition, map: Map): TilePosition[] {
  const tileShapeId = typeof tileShapeReference === 'string' ? tileShapeReference : tileShapeReference.shape;
  const options: ShapeOptions = typeof tileShapeReference === 'string' ? {map} : {map, size: tileShapeReference.size, includeOrigin: tileShapeReference.includeOrigin};
  const tileShape = tileShapes[tileShapeId];

  if (!tileShape) {
    return [];
  }

  return tileShape(origin, options).filter(position => isTileInMap(position, map.width, map.height));
}
