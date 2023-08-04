export default class BinaryHeap<T> {
  private content: T[];
  private scoreFunction: (node: T) => number;

  constructor(scoreFunction: (node: T) => number) {
    this.content = [];
    this.scoreFunction = scoreFunction;
  }

  push(node: T) {
    this.content.push(node);
    this.sinkDown(this.content.length - 1);
  }

  pop() {
    const result = this.content[0];
    const end = this.content.pop()!;

    if (this.content.length > 0) {
      this.content[0] = end;
      this.bubbleUp(0);
    }

    return result;
  }

  remove(node: T) {
    const index = this.content.indexOf(node);
    const end = this.content.pop()!;

    if (index !== this.content.length - 1) {
      this.content[index] = end;

      if (this.scoreFunction(end) < this.scoreFunction(node)) {
        this.sinkDown(index);
      } else {
        this.bubbleUp(index);
      }
    }
  }

  size() {
    return this.content.length;
  }

  rescoreElement(node: T) {
    this.sinkDown(this.content.indexOf(node));
  }

  private sinkDown(index: number) {
    const element = this.content[index];
    
    let n = index;

    while (n > 0) {
      const parentN = ((n + 1) >> 1) - 1;
      const parent = this.content[parentN];

      if (this.scoreFunction(element) < this.scoreFunction(parent)) {
        this.content[parentN] = element;
        this.content[n] = parent;

        n = parentN;
      } else {
        break;
      }
    }
  }

  private bubbleUp(index: number) {
    const length = this.content.length;
    const element = this.content[index];
    const elementScore = this.scoreFunction(element);

    let n = index;

    while (true) {
      const child2n = (n + 1) << 1;
      const child1n = child2n - 1;

      let swap: number | null = null;
      let child1score: number = elementScore;

      if (child1n < length) {
        const child1 = this.content[child1n];
        child1score = this.scoreFunction(child1);

        if (child1score < elementScore) {
          swap = child1n;
        }
      }

      if (child2n < length) {
        const child2 = this.content[child2n];
        const child2Score = this.scoreFunction(child2);

        if (child2Score < child1score) {
          swap = child2n;
        }
      }

      if (swap !== null) {
        this.content[n] = this.content[swap];
        this.content[swap] = element;
        n = swap;
      } else {
        break;
      }
    }
  }
}
