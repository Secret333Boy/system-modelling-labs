import BankClient from './BankClient';
import BlockingElement from './BlockingElement';
import Create from './Create';
import CustomRandom from './CustomRandom';
import Distribution from './Distribution';
import Model from './Model';
import Patient, { PatientType } from './Patient';
import PriorityQueue from './PriorityQueue';
import Process from './Process';
import Queue from './Queue';

const runTest = () => {
  const create = new Create(2);

  const p1 = new Process('p1', 1);
  const p2 = new Process('p2', 1);
  const p3 = new Process('p3', 1);

  const q1 = new Queue('q1', 2);
  const q2 = new Queue('q2', 2);
  const q3 = new Queue('q3', 3);

  const b1 = new BlockingElement('b1', (_obj, t) => t < 500);

  create.setDistribution(Distribution.EXPONENTIAL);
  p1.setDistribution(Distribution.EXPONENTIAL);
  p2.setDistribution(Distribution.EXPONENTIAL);
  p3.setDistribution(Distribution.EXPONENTIAL);

  create.setNextElements([q1]);
  q1.setNextElements([p1]);
  p1.setNextElements([q2]);
  q2.setNextElements([b1, q3]);
  b1.setNextElements([p2]);
  // p2.setNextElements([q3]);
  q3.setNextElements([p3]);

  const model = new Model([create, p1, p2, p3, q1, q2, q3, b1]);

  model.simulate(1000);
};

const runTask2Min = () => {
  const create = new Create(0.2);
  create.setDistribution(Distribution.EXPONENTIAL);

  const p1 = new Process('p1', 0.3);
  p1.setDistribution(Distribution.EXPONENTIAL);

  const p2 = new Process('p2', 0.3);
  p2.setDistribution(Distribution.EXPONENTIAL);

  const q1 = new Queue('q1', 3);
  const q2 = new Queue('q2', 3);

  const b1 = new BlockingElement('b1', () => q1.getLength() > q2.getLength());
  const b2 = new BlockingElement('b2', () => q2.getLength() >= q1.getLength());

  create.setNextElements([b1, b2]);
  b1.setNextElements([q1]);
  b2.setNextElements([q2]);
  q1.setNextElements([p1]);
  q2.setNextElements([p2]);

  const model = new Model([create, p1, p2, q1, q2, b1, b2]);
  model.simulate(1000);
};

const runTask2 = () => {
  const create = new Create(0.5, (t) => new BankClient(t));
  create.setDistribution(Distribution.EXPONENTIAL);

  const outputIntervals: number[] = [];
  const meanGeneralProcessingIntervals: number[] = [];
  let prevOutputT = 0;

  const p1 = new Process<BankClient>('p1', 0.3, (obj) => {
    if (prevOutputT) outputIntervals.push(p1.getCurrentT() - prevOutputT);
    prevOutputT = p1.getCurrentT();

    meanGeneralProcessingIntervals.push(p1.getCurrentT() - obj.bankEnterT);
    return obj;
  });
  p1.setDistribution(Distribution.EXPONENTIAL);

  const p2 = new Process<BankClient>('p2', 0.3, (obj) => {
    if (prevOutputT) outputIntervals.push(p2.getCurrentT() - prevOutputT);
    prevOutputT = p2.getCurrentT();

    meanGeneralProcessingIntervals.push(p2.getCurrentT() - obj.bankEnterT);

    return obj;
  });
  p2.setDistribution(Distribution.EXPONENTIAL);

  const qStart = new Queue<BankClient>('qStart');
  const q1 = new Queue<BankClient>('q1');
  const q2 = new Queue<BankClient>('q2');
  const q3 = new Queue<BankClient>('q3', 1);
  const q4 = new Queue<BankClient>('q4', 1);

  const b1 = new BlockingElement<BankClient>(
    'b1',
    () => q1.getLength() + q3.getLength() > q2.getLength() + q4.getLength()
  );
  const b2 = new BlockingElement<BankClient>(
    'b2',
    () => q2.getLength() + q4.getLength() >= q1.getLength() + q3.getLength()
  );
  const b3 = new BlockingElement<BankClient>(
    'b3',
    () => !(q4.getLength() === 0 && q1.getLength() - q2.getLength() >= 1)
  );
  const b4 = new BlockingElement<BankClient>(
    'b4',
    () => !(q3.getLength() === 0 && q2.getLength() - q1.getLength() >= 1)
  );

  const b5 = new BlockingElement<BankClient>('b5', () => q1.getLength() === 2);
  const b6 = new BlockingElement<BankClient>('b6', () => q2.getLength() === 2);

  create.setNextElements([qStart]);
  qStart.setNextElements([b1, b2]);

  b1.setNextElements([q3]);
  q3.setNextElements([b3, b5]);
  b3.setNextElements([q4]);
  b5.setNextElements([q1]);
  q1.setNextElements([p1]);

  b2.setNextElements([q4]);
  q4.setNextElements([b4, b6]);
  b4.setNextElements([q3]);
  b6.setNextElements([q2]);
  q2.setNextElements([p2]);

  const t = 1000;

  const model = new Model([
    create,
    p1,
    p2,
    qStart,
    q1,
    q2,
    q3,
    q4,
    b1,
    b2,
    b3,
    b4,
    b5,
    b6,
  ]);
  model.simulate(t);

  console.log('\nTask results:');
  console.log(`cashier 1 mean work time: ${p1.getTotalWorkTime() / t}`);
  console.log(`cashier 2 mean work time: ${p2.getTotalWorkTime() / t}`);
  console.log(
    `mean clients in bank: ${
      (q1.getMeanQueueLength() +
        q2.getMeanQueueLength() +
        q3.getMeanQueueLength() +
        q4.getMeanQueueLength()) /
      t
    }`
  );
  console.log(
    `mean output interval: ${
      outputIntervals.reduce((acc, el) => acc + el, 0) / outputIntervals.length
    }`
  );
  console.log(
    `mean client time in bank: ${
      meanGeneralProcessingIntervals.reduce((acc, el) => acc + el, 0) /
      meanGeneralProcessingIntervals.length
    }`
  );
  console.log(
    `failure rate: ${
      q3.getFailuresCount() / (q3.getQuantity() + q3.getFailuresCount()) +
      q4.getFailuresCount() / (q4.getQuantity() + q4.getFailuresCount())
    }`
  );
  console.log(`line change count: ${b3.getQuantity() + b4.getQuantity()}`);
};

const runTask3 = () => {
  let lastLabInputT = 0;
  const labInputIntervals: number[] = [];
  const processingIntervals: number[] = [];

  const create = new Create(15, (t) => {
    const rand = Math.random();
    const type =
      rand < 0.5
        ? PatientType.ONE
        : rand < 0.6
        ? PatientType.TWO
        : PatientType.THREE;

    return new Patient(type, t);
  });
  create.setDistribution(Distribution.EXPONENTIAL);

  const doctorDelayFunc = (obj: Patient) =>
    obj.type === PatientType.ONE ? 15 : obj.type === PatientType.TWO ? 40 : 30;
  const attendantDelayFunc = () => Math.random() * 5 + 3;
  const labTransferDelayFunc = () => Math.random() * 3 + 2;
  const labRegisterDelayFunc = () => CustomRandom.generateErlang(4.5, 3);
  const labAssistantDelayFunc = () => CustomRandom.generateErlang(4, 2);

  const attendantProcessingFunc = (obj: Patient, t: number) => {
    processingIntervals.push(t - obj.enterT);

    return obj;
  };
  const labAssistantProcessingFunc = (obj: Patient, t: number) => {
    if (obj.type === PatientType.THREE)
      processingIntervals.push(t - obj.enterT);

    return obj;
  };

  const doctor1 = new Process<Patient>('doctor1[p]', doctorDelayFunc);
  const doctor2 = new Process<Patient>('doctor2[p]', doctorDelayFunc);

  const attendant1 = new Process<Patient>(
    'attendant1[p]',
    attendantDelayFunc,
    attendantProcessingFunc
  );
  const attendant2 = new Process<Patient>(
    'attendant2[p]',
    attendantDelayFunc,
    attendantProcessingFunc
  );
  const attendant3 = new Process<Patient>(
    'attendant3[p]',
    attendantDelayFunc,
    attendantProcessingFunc
  );

  const transferToLabProcess = new Process<Patient>(
    'transfer to lab[p]',
    labTransferDelayFunc,
    (obj) => {
      if (lastLabInputT)
        labInputIntervals.push(
          transferToLabProcess.getCurrentT() - lastLabInputT
        );

      lastLabInputT = transferToLabProcess.getCurrentT();
      return obj;
    }
  );

  const labRegister = new Process<Patient>(
    'lab register[p]',
    labRegisterDelayFunc
  );

  const labAssistant1 = new Process<Patient>(
    'lab assistan1[p]',
    labAssistantDelayFunc,
    labAssistantProcessingFunc
  );
  const labAssistant2 = new Process<Patient>(
    'lab assistan2[p]',
    labAssistantDelayFunc,
    labAssistantProcessingFunc
  );

  const transferFromLabProcess = new Process<Patient>(
    'transfer from lab[p]',
    labTransferDelayFunc,
    (patient) => {
      patient.type = PatientType.ONE;
      return patient;
    }
  );

  const reception = new PriorityQueue<Patient>('reception[q]', (obj) =>
    obj.type === PatientType.ONE ? 1 : 0
  );
  const attendantWaiting = new Queue<Patient>('attendant waiting[q]');
  const toLabTransfering = new Queue<Patient>('to lab transfering[q]');
  const labReception = new Queue<Patient>('lab reception[q]');
  const labWaitingRoom = new Queue<Patient>('lab waiting room[q]');
  const fromLabTransfering = new Queue<Patient>('from lab transfering[q]');
  const labExit = new Queue<Patient>('lab exit[q]');

  const type1Block = new BlockingElement<Patient>(
    'type1Block',
    (obj) => obj.type !== PatientType.ONE
  );

  const type23Block = new BlockingElement<Patient>(
    'type23Block',
    (obj) => obj.type !== PatientType.TWO && obj.type !== PatientType.THREE
  );

  const type2Block = new BlockingElement<Patient>(
    'type2Block',
    (obj) => obj.type !== PatientType.TWO
  );

  const type13Block = new BlockingElement<Patient>(
    'type13Block',
    (obj) => obj.type !== PatientType.ONE && obj.type !== PatientType.THREE
  );

  create.setNextElements([reception]);
  reception.setNextElements([doctor1, doctor2]);

  doctor1.setNextElements([type1Block, type23Block]);
  doctor2.setNextElements([type1Block, type23Block]);

  type1Block.setNextElements([attendantWaiting]);
  attendantWaiting.setNextElements([attendant1, attendant2, attendant3]);

  type23Block.setNextElements([toLabTransfering]);
  toLabTransfering.setNextElements([transferToLabProcess]);
  transferToLabProcess.setNextElements([labReception]);
  labReception.setNextElements([labRegister]);
  labRegister.setNextElements([labWaitingRoom]);
  labWaitingRoom.setNextElements([labAssistant1, labAssistant2]);
  labAssistant1.setNextElements([type2Block, type13Block]);
  labAssistant2.setNextElements([type2Block, type13Block]);
  type13Block.setNextElements([labExit]);
  type2Block.setNextElements([fromLabTransfering]);
  fromLabTransfering.setNextElements([transferFromLabProcess]);
  transferFromLabProcess.setNextElements([reception]);

  const model = new Model([
    create,
    doctor1,
    doctor2,
    attendant1,
    attendant2,
    attendant3,
    transferToLabProcess,
    labRegister,
    labAssistant1,
    labAssistant2,
    transferFromLabProcess,
    reception,
    attendantWaiting,
    toLabTransfering,
    labReception,
    labWaitingRoom,
    fromLabTransfering,
    labExit,
    type1Block,
    type23Block,
    type2Block,
    type13Block,
  ]);

  model.simulate(10000);

  console.log('\nTask results:');
  console.log(
    `Mean processing time: ${
      processingIntervals.reduce((acc, el) => acc + el, 0) /
      processingIntervals.length
    }`
  );
  console.log(
    `Mean lab input interval: ${
      labInputIntervals.reduce((acc, el) => acc + el, 0) /
      labInputIntervals.length
    }`
  );
};

// runTest();
runTask2();
// runTask3();
