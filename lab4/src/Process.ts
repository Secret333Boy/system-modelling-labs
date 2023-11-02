import Distribution from './Distribution';
import Element from './Element';
import ModelObject from './ModelObject';

export default class Process<T extends ModelObject> extends Element<T> {
  private currentObject?: T;
  private totalWorkTime = 0;
  private prevWorkStart = 0;

  constructor(
    name: string,
    delayFunc: (obj: T) => number,
    modifyObj?: (obj: T, t: number) => T
  );
  constructor(name: string, delay: number, modifyObj?: (obj: T) => T);
  constructor(
    name: string,
    delay?: number | ((obj: T) => number),
    private readonly modifyObj: (obj: T, t: number) => T = (obj) => obj
  ) {
    const isDelayFunction = typeof delay === 'function';

    super(name, Distribution.STATIC, isDelayFunction ? 0 : delay);

    this.setNextT(Infinity);

    if (isDelayFunction) {
      this.setDelayFunction(delay);
    }
  }

  public inAction(obj: T): void {
    this.currentObject = obj;

    this.setNextT(this.getCurrentT() + this.getDelay(obj));
    this.prevWorkStart = this.getCurrentT();
  }

  public outAction(): void {
    super.outAction();

    if (!this.currentObject)
      throw new Error('Tried to perform outAction on unbusy process');

    const modifiedObject = this.modifyObj(
      this.currentObject,
      this.getCurrentT()
    );

    const nextElement = this.getNextElement(modifiedObject);

    if (this.getNextElementsOptions().length > 0 && !nextElement)
      throw new Error(
        'Tried to perform outAction on process without free next element'
      );

    nextElement?.inAction(modifiedObject);

    this.currentObject = undefined;
    this.setNextT(Infinity);
    this.totalWorkTime += this.getCurrentT() - this.prevWorkStart;
  }

  public isBusy() {
    return !!this.currentObject;
  }

  public getTotalWorkTime() {
    return this.totalWorkTime;
  }

  public isReadyForIn(): boolean {
    return !this.isBusy();
  }
}
