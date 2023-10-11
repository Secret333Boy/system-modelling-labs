import exponential from './exponential';

export default (lambda: number) => {
  const exp = exponential(lambda);

  return (x1: number, x2: number) => exp(x2) - exp(x1);
};
