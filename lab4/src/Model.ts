import Element from './Element';
import ModelObject from './ModelObject';
import Process from './Process';
import Queue from './Queue';

export default class Model<T extends ModelObject> {
  private elements: Element<T>[] = [];
  private currentT: number = 0;
  private nextT: number = 0;
  private event: number = 0;
  private eventsCount: number = 0;

  constructor(elements: Element<T>[]) {
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
      // console.log(
      //   '\nIts time for event in ' +
      //     this.elements[this.event].getIdentifier() +
      //     ', time = ' +
      //     this.nextT
      // );

      for (const element of this.elements) {
        element.doStatistics(this.nextT - this.currentT);
      }

      this.currentT = this.nextT;
      for (const element of this.elements) {
        element.setCurrentT(this.currentT);
      }
      for (const element of this.elements) {
        if (element.getNextT() === this.currentT) {
          element.outAction();
          this.eventsCount++;
        }
      }
      // this.printInfo();
    }
    // this.printResult();
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
      if (element instanceof Queue) {
        console.log(
          `mean length of queue = ${
            element.getMeanQueueLength() / this.currentT
          }\nfailure probability = ${
            element.getFailuresCount() /
            (element.getQuantity() + element.getFailuresCount())
          }\n`
        );
      }

      if (element instanceof Process) {
        console.log(
          `mean work time = ${element.getTotalWorkTime() / this.currentT}\n`
        );
      }
    }
  }

  public getEventsCount() {
    return this.eventsCount;
  }
}
