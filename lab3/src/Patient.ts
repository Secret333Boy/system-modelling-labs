import ModelObject from './ModelObject';

export enum PatientType {
  ONE = 1,
  TWO = 2,
  THREE = 3,
}

export default class Patient extends ModelObject {
  constructor(public type: PatientType) {
    super();
  }
}
