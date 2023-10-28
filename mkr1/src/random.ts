const arr = [
  [0, 0],
  [2, 0.3],
  [4, 0.7],
  [6, 0.9],
  [10, 1.0],
];

let y = 0;
let x = 0;

for (let i = 0; i < arr.length - 1; i++) {
  const min = arr[i][1];
  const max = arr[i + 1][1];

  y = uniform(min, max);
  x = arr[i][0] + ((arr[i + 1][0] - arr[i][0]) * (y - min)) / (max - min);
}

console.log(`x=${x}\ny=${y}`);
