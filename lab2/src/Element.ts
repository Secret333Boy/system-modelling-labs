import CustomRandom from './CustomRandom';
import Distribution from './Distribution';

export default abstract class Element {
  protected static nextId = 0;

  public readonly id: number;
  public readonly name: string;
  private nextElements: { element: Element; probability: number }[] = [];
  private nextT: number = 0;
  private currentT: number = 0;
  private distribution: Distribution;
  public readonly delayMean: number;
  public readonly delayVariance: number;
  protected quantity: number = 0;
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
        return CustomRandom.generateExponential(1 / this.delayMean);
      case Distribution.UNIFORM:
        return CustomRandom.generateUniform() * 2 * this.delayMean;
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
    elements: { element: Element; probability: number }[]
  ) {
    if (elements.reduce((acc, el) => acc + el.probability, 0) !== 1)
      throw new Error('Sum of possibilities should equal 1');

    this.nextElements = elements;
  }

  public getNextElement() {
    const rand = Math.random();

    let sum = 0;

    for (const { element, probability } of this.nextElements) {
      sum += probability;

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

  public printResult() {
    console.log(this.name + ' quantity = ' + this.quantity + '\n');
  }

  public printInfo() {
    console.log(
      this.name +
        ' state= ' +
        this.state +
        ' quantity = ' +
        this.quantity +
        ' tnext= ' +
        this.nextT
    );
  }

  public setDistribution(distribution: Distribution) {
    this.distribution = distribution;
  }
}
