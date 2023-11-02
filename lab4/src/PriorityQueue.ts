import ModelObject from './ModelObject';
import Queue from './Queue';

export default class PriorityQueue<T extends ModelObject> extends Queue<T> {
  constructor(
    name: string,
    private readonly getPriority: (obj: T) => number,
    size?: number
  ) {
    super(name, size);
  }

  public enqueue(item: T): boolean {
    if (this.items.length === this.size) return false;

    const priority = this.getPriority(item);

    let i = this.items.length - 1;

    while (i >= 0 && priority > this.getPriority(this.items[i])) {
      i--;
    }

    this.items.splice(i + 1, 0, item);

    return true;
  }
}
