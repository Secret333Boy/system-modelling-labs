import CustomRandom from './CustomRandom';
import Distribution from './Distribution';

export default abstract class Element {
  private static nextId = 0;

  public readonly id: number;
  public readonly name: string;
  public readonly nextElements: { element: Element; possibility: number }[] =
    [];
  public readonly nextT: number = 0;
  public readonly currentT: number = 0;
  public readonly distribution: Distribution;
  public readonly delayMean: number;
  public readonly delayVariance: number;
  private quantity: number = 0;

  constructor(
    name = '',
    distribution = Distribution.STATIC,
    delayMean = 0,
    delayVariance = 0
  ) {
    this.id = Element.nextId++;
    this.name = name;
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
}
