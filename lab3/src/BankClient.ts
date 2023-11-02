import ModelObject from './ModelObject';

export default class BankClient extends ModelObject {
  constructor(public readonly bankEnterT: number) {
    super();
  }
}
