import Distribution from './Distribution';
import Element from './Element';

export default class Process extends Element {
  private queue = 0;
  private maxQueueLength = Number.MAX_VALUE;
  private fails = 0;
  private meanQueue = 0;

  constructor(delay: number) {
    super('process' + Element.nextId, Distribution.STATIC, delay);
  }

  public inAction() {
    super.inAction();

    if (this.state === 0) {
      this.state = 1;
      this.setNextT(this.getCurrentT() + this.getDelay());
      return;
    }

    if (this.queue < this.maxQueueLength) {
      this.queue++;
      return;
    }

    this.fails++;
  }

  public outAction() {
    super.outAction();

    if (this.queue === 0) {
      this.setNextT(Infinity);
      this.state = 0;
      return;
    }

    this.queue--;
    this.state = 1;
    this.setNextT(this.getCurrentT() + this.getDelay());
  }

  public doStatistics(delta: number) {
    this.meanQueue += this.queue * delta;
  }

  public getQueue() {
    return this.queue;
  }

  public getMeanQueue() {
    return this.meanQueue;
  }

  public setMaxQueueLength(length: number) {
    this.maxQueueLength = length;
  }
}
