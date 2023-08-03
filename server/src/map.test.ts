import Map from './map';

describe('Map', () => {
  let map: Map;

  beforeEach(() => {
    map = new Map(7, 5, {Player: [0, 6, 28, 34], Boss: [17], Minion: [11, 13]});
  });

  test('render debug', () => {
    map['entityTiles'][0] = 1;
    map['entityTiles'][6] = 2;
    map['entityTiles'][17] = 3;
    map['entityTiles'][28] = 4;
    map['entityTiles'][34] = 5;

    expect(map.debugRender()).toBe(
`
1 0 0 0 0 0 2 
0 0 0 0 0 0 0 
0 0 0 3 0 0 0 
0 0 0 0 0 0 0 
4 0 0 0 0 0 5 
`);
  });

  test('place entity', () => {
    map.placeEntity(1, {x: 0, y: 0});
    map.placeEntity(2, {x: 4, y: 0});
    map.placeEntity(3, {x: 2, y: 2});
    map.placeEntity(4, {x: 0, y: 4});
    map.placeEntity(5, {x: 4, y: 4});

    expect(map.debugRender()).toBe(
`
1 0 0 0 2 0 0 
0 0 0 0 0 0 0 
0 0 3 0 0 0 0 
0 0 0 0 0 0 0 
4 0 0 0 5 0 0 
`);
  });

  test('swap tiles', () => {
    map.placeEntity(1, {x: 3, y: 0});

    expect(map.debugRender()).toBe(
`
0 0 0 1 0 0 0 
0 0 0 0 0 0 0 
0 0 0 0 0 0 0 
0 0 0 0 0 0 0 
0 0 0 0 0 0 0 
`);

    map.swapTiles({x: 3, y: 0}, {x: 4, y: 0});

    expect(map.debugRender()).toBe(
`
0 0 0 0 1 0 0 
0 0 0 0 0 0 0 
0 0 0 0 0 0 0 
0 0 0 0 0 0 0 
0 0 0 0 0 0 0 
`);
  });

  test('get entity position', () => {
    map.placeEntity(1, {x: 1, y: 1});
    map.placeEntity(2, {x: 4, y: 1});
    map.placeEntity(3, {x: 2, y: 2});
    map.placeEntity(4, {x: 6, y: 3});
    map.placeEntity(5, {x: 2, y: 4});
    map.placeEntity(6, {x: 4, y: 3});
    map.placeEntity(7, {x: 0, y: 3});

    expect(map.debugRender()).toBe(
`
0 0 0 0 0 0 0 
0 1 0 0 2 0 0 
0 0 3 0 0 0 0 
7 0 0 0 6 0 4 
0 0 5 0 0 0 0 
`);

      expect(map.getEntityTilePosition(1)).toEqual({x: 1, y: 1});
      expect(map.getEntityTilePosition(2)).toEqual({x: 4, y: 1});
      expect(map.getEntityTilePosition(3)).toEqual({x: 2, y: 2});
      expect(map.getEntityTilePosition(4)).toEqual({x: 6, y: 3});
      expect(map.getEntityTilePosition(5)).toEqual({x: 2, y: 4});
      expect(map.getEntityTilePosition(6)).toEqual({x: 4, y: 3});
      expect(map.getEntityTilePosition(7)).toEqual({x: 0, y: 3});
  });

  test('get entity position 5x7', () => {
    map = new Map(5, 7, {});

    map.placeEntity(1, {x: 1, y: 1});
    map.placeEntity(2, {x: 4, y: 1});
    map.placeEntity(3, {x: 2, y: 2});
    map.placeEntity(4, {x: 4, y: 0});
    map.placeEntity(5, {x: 2, y: 4});
    map.placeEntity(6, {x: 1, y: 6});
    map.placeEntity(7, {x: 0, y: 3});

    expect(map.debugRender()).toBe(
`
0 0 0 0 4 
0 1 0 0 2 
0 0 3 0 0 
7 0 0 0 0 
0 0 5 0 0 
0 0 0 0 0 
0 6 0 0 0 
`);

      expect(map.getEntityTilePosition(1)).toEqual({x: 1, y: 1});
      expect(map.getEntityTilePosition(2)).toEqual({x: 4, y: 1});
      expect(map.getEntityTilePosition(3)).toEqual({x: 2, y: 2});
      expect(map.getEntityTilePosition(4)).toEqual({x: 4, y: 0});
      expect(map.getEntityTilePosition(5)).toEqual({x: 2, y: 4});
      expect(map.getEntityTilePosition(6)).toEqual({x: 1, y: 6});
      expect(map.getEntityTilePosition(7)).toEqual({x: 0, y: 3});
  });
});
