export default (o: number, a: number) => (x: number) =>
  Math.E ** (-0.5 * ((x - a) / o) ** 2) / (o * Math.sqrt(2 * Math.PI));
