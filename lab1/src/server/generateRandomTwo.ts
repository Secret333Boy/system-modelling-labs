export default (o: number, a: number) => {
  let nu = 0;

  for (let i = 0; i < 12; i++) {
    nu += Math.random();
  }

  nu -= 6;

  return o * nu + a;
};
