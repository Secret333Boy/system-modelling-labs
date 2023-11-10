import Create from './Create';
import Model from './Model';
import ProcessingSystem from './ProcessingSystem';

const createModelOneChain = (n: number) => {
  const create = new Create(1);

  const processingSystems: ProcessingSystem[] = [];

  for (let i = 0; i < n; i++) {
    const ps = new ProcessingSystem(1, 1);

    if (i > 0) processingSystems[i - 1].setNextProcessingSystem(ps);

    processingSystems.push(ps);
  }

  create.setNextElements([processingSystems[0].getQueue()]);

  return new Model([
    create,
    ...processingSystems
      .map((ps) => ps.getElements())
      .reduce((acc, el) => [...acc, ...el], []),
  ]);
};

const createModelTwoChains = (n: number) => {
  const create = new Create(1);

  const processingSystems: ProcessingSystem[] = [];

  for (let i = 0; i < n; i++) {
    const ps = new ProcessingSystem(1, 1);

    if (i > 1) processingSystems[i - 2].setNextProcessingSystem(ps);

    processingSystems.push(ps);
  }

  create.setNextElements([
    processingSystems[0].getQueue(),
    processingSystems[1].getQueue(),
  ]);

  return new Model([
    create,
    ...processingSystems
      .map((ps) => ps.getElements())
      .reduce((acc, el) => [...acc, ...el], []),
  ]);
};

const results: { [N: number]: number } = {};

const k = 5;

for (let N = 10; N <= 300; N += 10) {
  const Nresults: number[] = [];

  for (let i = 0; i < k; i++) {
    const model = createModelOneChain(N);

    const startTime = Date.now();
    model.simulate(10000);
    const endTime = Date.now();
    Nresults.push(endTime - startTime);
  }

  results[N] = Nresults.reduce((acc, el) => acc + el, 0) / k;
}

console.table(results);
