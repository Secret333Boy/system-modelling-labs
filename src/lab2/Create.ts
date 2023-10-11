import Distribution from './Distribution';
import Element from './Element';

export default class Create extends Element {
  constructor(delay: number) {
    super('create', Distribution.STATIC, delay);
  }

  public outAction() {
    super.outAction();
    super.setNextT(super.getCurrentT() + super.getDelay());
    super.getNextElement()?.inAction();
  }
}
