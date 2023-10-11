import CustomRandom from './CustomRandom';
import Distribution from './Distribution';

export default abstract class Element {
  protected static nextId = 0;

  public readonly id: number;
  public readonly name: string;
  private nextElements: { element: Element; possibility: number }[] = [];
  private nextT: number = 0;
  private currentT: number = 0;
  public readonly distribution: Distribution;
  public readonly delayMean: number;
  public readonly delayVariance: number;
  private quantity: number = 0;
  protected state: number = 0;

  constructor(
    name = '',
    distribution = Distribution.STATIC,
    delayMean = 0,
    delayVariance = 0
  ) {
    this.id = Element.nextId++;
    this.name = name || 'element' + this.id;
    this.distribution = distribution;
    this.delayMean = delayMean;
    this.delayVariance = delayVariance;
  }

  public getDelay(): number {
    switch (this.distribution) {
      case Distribution.NORMAL:
        return CustomRandom.generateNormal(
          Math.sqrt(this.delayVariance),
          this.delayMean
        );
      case Distribution.EXPONENTIAL:
        return CustomRandom.generateExp(1 / this.delayMean);
      case Distribution.STATIC:
      default:
        return this.delayMean;
    }
  }

  public inAction() {}

  public outAction() {
    this.quantity++;
  }

  public getQuantity() {
    return this.quantity;
  }

  public setNextElements(
    elements: { element: Element; possibility: number }[]
  ) {
    if (elements.reduce((acc, el) => acc + el.possibility, 0) !== 1)
      throw new Error('Sum of possibilities should equal 1');

    this.nextElements = elements;
  }

  public getNextElement() {
    const rand = Math.random();

    let sum = 0;

    for (const { element, possibility } of this.nextElements) {
      sum += possibility;

      if (rand < sum) return element;
    }

    return undefined;
  }

  public getNextT() {
    return this.nextT;
  }

  public setNextT(t: number) {
    this.nextT = t;
  }

  public getCurrentT() {
    return this.currentT;
  }

  public setCurrentT(t: number) {
    this.currentT = t;
  }

  public doStatistics(delta: number) {}
}
