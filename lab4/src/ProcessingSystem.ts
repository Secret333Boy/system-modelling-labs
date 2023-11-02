import Element from './Element';
import ModelObject from './ModelObject';
import Process from './Process';
import Queue from './Queue';

export default class ProcessingSystem<T extends ModelObject = ModelObject> {
  private queue: Queue<T>;
  private processes: Process<T>[];

  constructor(
    meanProcessingTime: number,
    processesCount = 1,
    queueLength = Infinity
  ) {
    const queue = new Queue<T>('ps queue', queueLength);

    const processes: Process<T>[] = [];

    for (let i = 0; i < processesCount; i++) {
      processes.push(new Process<T>('ps process' + i, meanProcessingTime));
    }

    queue.setNextElements(processes);

    this.queue = queue;
    this.processes = processes;
  }

  public getElements() {
    return [...this.processes, this.queue];
  }

  public getQueue() {
    return this.queue;
  }

  public setNextElement(element: Element<T>) {
    for (const process of this.processes) {
      process.setNextElements([element]);
    }
  }

  public setNextProcessingSystem(processingSystem: ProcessingSystem<T>) {
    const nextQueue = processingSystem.getQueue();

    this.setNextElement(nextQueue);
  }
}
