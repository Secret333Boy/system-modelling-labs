import Distribution from './Distribution';
import Element from './Element';

export default class Process extends Element {
  private queue = 0;
  private maxQueueLength = Number.MAX_VALUE;
  private fails = 0;
  private meanQueue = 0;
  private meanBusyResources = 0;
  private resourcesCount = 1;

  constructor(delay: number) {
    super('process' + Element.nextId, Distribution.STATIC, delay);
  }

  public inAction() {
    super.inAction();

    if (this.state !== this.resourcesCount) {
      this.state++;
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
    const nextElement = super.getNextElement();

    this.quantity += this.state;

    for (let i = 0; i < this.state; i++) {
      nextElement?.inAction();
    }

    this.setNextT(Infinity);
    this.state = 0;

    if (this.queue > 0) {
      while (this.state < this.resourcesCount && this.queue > 0) {
        this.queue--;
        this.state++;
      }

      this.setNextT(this.getCurrentT() + this.getDelay());
    }
  }

  public doStatistics(delta: number) {
    this.meanQueue += this.queue * delta;
    this.meanBusyResources += this.state * delta;
  }

  public getQueue() {
    return this.queue;
  }

  public getMeanQueue() {
    return this.meanQueue;
  }

  public getMeanBusyResources() {
    return this.meanBusyResources;
  }

  public setMaxQueueLength(length: number) {
    this.maxQueueLength = length;
  }

  public setResourcesCount(resourcesCount: number) {
    this.resourcesCount = resourcesCount;
  }

  public getFails() {
    return this.fails;
  }

  public printInfo() {
    super.printInfo();
    console.log('fails = ' + this.fails);
  }
}
