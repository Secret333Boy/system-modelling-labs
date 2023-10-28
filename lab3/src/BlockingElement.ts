import Element from './Element';
import ModelObject from './ModelObject';

export default class BlockingElement<T extends ModelObject> extends Element<T> {
  private currentObject?: T;

  constructor(
    name: string,
    public readonly isBlocked: (obj: T, t: number) => boolean
  ) {
    super(name);
    this.setNextT(Infinity);
  }

  public inAction(obj: T): void {
    if (this.isBlocked(obj, this.getCurrentT()))
      throw new Error('Tried to perform inAction on blocked element');

    this.currentObject = obj;
    this.setNextT(this.getCurrentT());
  }

  public outAction(): void {
    if (!this.currentObject)
      throw new Error('Tried to perform outAction on unbusy blocking element');

    super.outAction();

    const nextElement = this.getNextElement(this.currentObject);

    if (this.getNextElementsOptions().length > 0 && !nextElement)
      throw new Error(
        'Tried to perform outAction on blocking element without free next element'
      );

    nextElement?.inAction(this.currentObject);
    this.currentObject = undefined;
    this.setNextT(Infinity);
  }

  public isReadyForIn(obj: T): boolean {
    const nextElement = this.getNextElement(obj);

    return (
      !this.currentObject &&
      !this.isBlocked(obj, this.getCurrentT()) &&
      !!nextElement &&
      nextElement.isReadyForIn(obj)
    );
  }
}
