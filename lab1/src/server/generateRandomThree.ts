const a = 5 ** 13;
const c = 2 ** 31;

let prev = 1;

export default () => {
  prev = (a * prev) % c;
  return prev / c;
};
