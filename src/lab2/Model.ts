import Element from './Element';
import Process from './Process';

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
    for (const element of this.elements) {
      element.printInfo();
    }
  }

  public printResult() {
    console.log('\n-------------RESULTS-------------');
    for (const element of this.elements) {
      element.printResult();
      if (element instanceof Process) {
        console.log(
          `mean length of queue = ${
            element.getMeanQueue() / this.currentT
          }\nmean resources busy = ${
            element.getMeanBusyResources() / this.currentT
          }\nfailure probability = ${
            element.getFails() / (element.getQuantity() + element.getFails())
          }\n`
        );
      }
    }
  }
}
