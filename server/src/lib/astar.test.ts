import astarSearch, { Graph } from './astar';

describe('astar', () => {
  test('simple', () => {
    const graph = new Graph([
      [1, 1, 1, 1],
      [1, 1, 1, 1],
      [1, 1, 1, 1],
      [1, 1, 1, 1],
    ]);

    const path = astarSearch(graph, graph.getNode(0, 0), graph.getNode(3, 3));

    console.log(path.map(({x, y}) => ({x, y})));
  });
});
