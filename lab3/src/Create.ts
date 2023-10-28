import Distribution from './Distribution';
import Element from './Element';
import ModelObject from './ModelObject';

export default class Create<T extends ModelObject> extends Element<T> {
  constructor(
    delay: number,
    private readonly createObject = () => new ModelObject() as T
  ) {
    super('create', Distribution.STATIC, delay);
  }

  public inAction(): void {
    throw new Error('Tried to call inAction on Create');
  }

  public outAction() {
    const newObj = this.createObject();

    super.outAction();
    super.setNextT(super.getCurrentT() + super.getDelay(newObj));
    super.getNextElement(newObj)?.inAction(newObj);
  }
}
