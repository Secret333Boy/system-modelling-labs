import Create from './Create';
import Distribution from './Distribution';
import Model from './Model';
import Process from './Process';

const create = new Create(2);
const p1 = new Process(1);
const p2 = new Process(1);
const p3 = new Process(1);

create.setNextElements([{ element: p1, probability: 1 }]);
p1.setNextElements([{ element: p2, probability: 1 }]);
p2.setNextElements([{ element: p3, probability: 1 }]);

p1.setMaxQueueLength(2);
p2.setMaxQueueLength(2);
p3.setMaxQueueLength(3);

create.setDistribution(Distribution.EXPONENTIAL);
p1.setDistribution(Distribution.EXPONENTIAL);
p2.setDistribution(Distribution.EXPONENTIAL);
p3.setDistribution(Distribution.EXPONENTIAL);

p1.setResourcesCount(1);
p2.setResourcesCount(1);
p3.setResourcesCount(1);

const model = new Model([create, p1, p2, p3]);

model.simulate(1000);
