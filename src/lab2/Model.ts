import Element from './Element';

export default class Model {
  private elements: Element[] = [];
  private currentT: number = 0;
  private nextT: number = 0;
  private event: number = 0;

  constructor(elements: Element[]) {
    this.elements = elements;
  }

  public simulate(t: number) {
    while (this.currentT < t) {
      this.nextT = Infinity;
      for (let i = 0; i < this.elements.length; i++) {
        const element = this.elements[i];
        if (element.getNextT() < this.nextT) {
          this.nextT = element.getNextT();
          this.event = i;
        }
      }
      console.log(
        '\nIts time for event in ' +
          this.elements[this.event].name +
          ', time = ' +
          this.nextT
      );
      for (const element of this.elements) {
        element.doStatistics(this.nextT - this.currentT);
      }
      this.currentT = this.nextT;
      for (const element of this.elements) {
        element.setCurrentT(this.currentT);
      }
      this.elements[this.event].outAction();
      for (const element of this.elements) {
        if (element.getNextT() === this.currentT) {
          element.outAction();
        }
      }
      this.printInfo();
    }
    this.printResult();
  }

  public printInfo() {
    // todo
  }

  public printResult() {
    // todo
  }
}
