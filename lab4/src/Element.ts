import CustomRandom from './CustomRandom';
import Distribution from './Distribution';
import ModelObject from './ModelObject';

export default abstract class Element<T extends ModelObject> {
  private static nextId = 0;

  protected id = Element.getNextId();
  private currentT = 0;
  protected nextT = 0;
  protected quantity = 0;
  protected nextElementsOptions:
    | { type: 'simple'; elements: Element<T>[] }
    | {
        type: 'possibilities';
        options: { element: Element<T>; probability: number }[];
      } = { type: 'simple', elements: [] };
  private delayFunction?: (obj: T) => number;

  constructor(
    protected name = '',
    private distribution: Distribution = Distribution.STATIC,
    private delayMean = 0,
    private delayVariance = 0
  ) {}

  public static getNextId() {
    return this.nextId++;
  }

  public getDelay(obj: T): number {
    if (this.delayFunction) return this.delayFunction(obj);

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

  public inAction(obj: T) {}

  public outAction() {
    this.quantity++;
  }

  public setNextElements(elements: Element<T>[]) {
    this.nextElementsOptions = { type: 'simple', elements };
  }

  public setNextPossibleElements(
    options: { element: Element<T>; probability: number }[]
  ) {
    if (options.reduce((acc, el) => acc + el.probability, 0) !== 1)
      throw new Error('Sum of possibilities should equal 1');

    this.nextElementsOptions = { type: 'possibilities', options };
  }

  public getNextElement(obj: T) {
    if (this.nextElementsOptions.type === 'simple') {
      for (const element of this.nextElementsOptions.elements) {
        if (element.isReadyForIn(obj)) return element;
      }

      return;
    }

    const rand = Math.random();

    let sum = 0;

    for (const { element, probability } of this.nextElementsOptions.options) {
      sum += probability;

      if (rand < sum) return element;
    }

    return;
  }

  public getClosestNextElement(obj: T) {
    let closestElement: Element<T> | undefined = undefined;

    const elements = this.getNextElementsOptions();

    for (const element of elements) {
      if (
        element.isReadyForIn(obj) &&
        (!closestElement || element.nextT < closestElement.nextT)
      ) {
        closestElement = element;
      }
    }

    return closestElement;
  }

  public setCurrentT(t: number) {
    this.currentT = t;
  }

  public setNextT(t: number) {
    this.nextT = t;
  }

  public getCurrentT() {
    return this.currentT;
  }

  public getNextT() {
    return this.nextT;
  }

  public getQuantity() {
    return this.quantity;
  }

  public printResult() {
    console.log(`${this.name}[${this.id}] quantity = ${this.quantity}`);
  }

  public printInfo() {
    console.log(
      `${this.name}[${this.id}] quantity = ${this.quantity} tnext= ${this.nextT}`
    );
  }

  public setDistribution(distribution: Distribution) {
    this.distribution = distribution;
  }

  public setDelayFunction(func: (obj: T) => number) {
    this.delayFunction = func;
  }

  public getIdentifier() {
    return `${this.name}[${this.id}]`;
  }

  public doStatistics(delta: number) {}

  public isReadyForIn(obj: T) {
    return true;
  }

  public getNextElementsOptions() {
    return this.nextElementsOptions.type === 'simple'
      ? this.nextElementsOptions.elements
      : this.nextElementsOptions.options.map((option) => option.element);
  }
}
