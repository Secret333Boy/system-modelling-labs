import Element from './Element';
import ModelObject from './ModelObject';

export default class Queue<T extends ModelObject> extends Element<T> {
  protected items: T[] = [];
  private failuresCount = 0;
  private meanQueueLength = 0;

  constructor(
    name: string,
    public readonly size: number = Infinity
  ) {
    super(name);
    this.setNextT(Infinity);
  }

  public enqueue(item: T) {
    if (this.items.length === this.size) return false;

    this.items.push(item);

    return true;
  }

  public dequeue() {
    return this.items.shift();
  }

  public getLength() {
    return this.items.length;
  }

  public inAction(obj: T): void {
    if (!this.enqueue(obj)) this.failuresCount++;
  }

  public outAction(): void {
    const obj = this.dequeue();

    if (!obj) throw new Error('Tried to perfrom outAction on empty queue');

    const nextElement = this.getNextElement(obj);

    if (this.getNextElementsOptions().length > 0 && !nextElement)
      throw new Error(
        'Tried to perform outAction on queue without free next element'
      );

    super.outAction();

    nextElement?.inAction(obj);
  }

  public getNextT() {
    const closestNextElement = this.getClosestNextElement(this.items[0]);

    return this.items.length === 0 || !closestNextElement
      ? Infinity
      : closestNextElement.isReadyForIn(this.items[0])
      ? this.getCurrentT()
      : closestNextElement.getNextT();
  }

  public doStatistics(delta: number): void {
    this.meanQueueLength += this.items.length * delta;
  }

  public printInfo() {
    console.log(
      `${this.name}[${this.id}] quantity = ${this.quantity} tnext = ${this.nextT} length = ${this.items.length}`
    );
  }

  public getFailuresCount() {
    return this.failuresCount;
  }

  public getMeanQueueLength() {
    return this.meanQueueLength;
  }
}
