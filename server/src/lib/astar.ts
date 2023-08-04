import BinaryHeap from './binary-heap';

function heuristic(node0: GraphNode, node1: GraphNode) {
  const d1 = Math.abs(node1.x - node0.x);
  const d2 = Math.abs(node1.y - node0.y);
  return d1 + d2;
}

function pathTo(node: GraphNode) {
  let current = node;
  const path: GraphNode[] = [];

  while (current.parent) {
    path.unshift(current);
    current = current.parent;
  }

  return path;
}

export default function astarSearch(graph: Graph, start: GraphNode, end: GraphNode) {
  const heap = new BinaryHeap<GraphNode>(n => n.f);
  let closestNode = start;
  start.h = heuristic(start, end);
  heap.push(start);


  while (heap.size() > 0) {
    const currentNode = heap.pop();

    if (currentNode === end) {
      return pathTo(currentNode);
    }

    currentNode.closed = true; 

    for (const neighbor of graph.neighbors(currentNode)) {
      if (neighbor.closed || neighbor.isWall()) {
        continue;
      }

      const gScore = currentNode.g + neighbor.weight;
      const beenVisited = neighbor.visited;

      if (!beenVisited || gScore < neighbor.g) {
        neighbor.visited = true;
        neighbor.parent = currentNode;
        neighbor.h = neighbor.h || heuristic(neighbor, end);
        neighbor.g = gScore;
        neighbor.f = neighbor.g + neighbor.h;

        if (neighbor.h < closestNode.h || (neighbor.h === closestNode.h && neighbor.g < closestNode.g)) {
          closestNode = neighbor;
        }

        if (!beenVisited) {
          heap.push(neighbor);
        } else {
          heap.rescoreElement(neighbor);
        }
      }
    }
  }

  return pathTo(closestNode);
}

class GraphNode {
  x: number;
  y: number;
  weight: number;
  f: number;
  g: number;
  h: number;
  visited: boolean;
  closed: boolean;
  parent: GraphNode | null;

  constructor(x: number, y: number, weight: number) {
    this.x = x;
    this.y = y;
    this.weight = weight;

    this.f = 0;
    this.g = 0;
    this.h = 0;
    this.visited = false;
    this.closed = false;
    this.parent = null;
  }

  isWall() {
    return this.weight === 0;
  }
}

export class Graph {
  private grid: GraphNode[][];

  constructor(weights: number[][]) {
    this.grid = [];

    for (let x = 0; x < weights.length; x++) {
      this.grid[x] = [];
  
      for (let y = 0, row = weights[x]; y < row.length; y++) {
        const node = new GraphNode(x, y, row[y]);
        this.grid[x][y] = node;
      }
    }
  }

  getNode(x: number, y: number) {
    return this.grid[x][y];
  }

  neighbors(node: GraphNode) {
    const result = [];
    const x = node.x;
    const y = node.y;
    const grid = this.grid;

    if (grid[x - 1] && grid[x - 1][y]) {
      result.push(grid[x - 1][y]);
    }

    if (grid[x + 1] && grid[x + 1][y]) {
      result.push(grid[x + 1][y]);
    }

    if (grid[x] && grid[x][y - 1]) {
      result.push(grid[x][y - 1]);
    }

    if (grid[x] && grid[x][y + 1]) {
      result.push(grid[x][y + 1]);
    }

    return result;
  }

  toString() {
    const graphString = [];
    const nodes = this.grid;
    for (let x = 0; x < nodes.length; x++) {
      const rowDebug = [];
      const row = nodes[x];
      for (let y = 0; y < row.length; y++) {
        rowDebug.push(row[y].weight);
      }
      graphString.push(rowDebug.join(" "));
    }
    return graphString.join("\n");
  }
}
