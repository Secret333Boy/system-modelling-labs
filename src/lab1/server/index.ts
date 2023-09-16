import express from 'express';
import cors from 'cors';
import generateRandomOne from './generateRandomOne';
import generateRandomTwo from './generateRandomTwo';

const app = express();

app.use(cors());

app.get('/one', (req, res) => {
  const numbers: number[] = [];

  const n = 10000;

  for (let i = 0; i < n; i++) {
    numbers.push(generateRandomOne(1));
  }

  const countTable: { [key: number]: number } = {};

  for (const number of numbers) {
    const index = Math.round(number);

    countTable[index] = (countTable[index] || 0) + 1;
  }

  const freqTable = Object.entries(countTable)
    .map((item) => ({
      x: +item[0],
      y: item[1] / n,
    }))
    .sort((a, b) => a.x - b.x);

  res.json(freqTable);
});

app.get('/two', (req, res) => {
  const numbers: number[] = [];

  const n = 10000;

  for (let i = 0; i < n; i++) {
    numbers.push(generateRandomTwo(1, 1));
  }

  const countTable: { [key: number]: number } = {};

  for (const number of numbers) {
    const index = Math.round(number);

    countTable[index] = (countTable[index] || 0) + 1;
  }

  const freqTable = Object.entries(countTable)
    .map((item) => ({
      x: +item[0],
      y: item[1] / n,
    }))
    .sort((a, b) => a.x - b.x);

  res.json(freqTable);
});

app.get('/three', (req, res) => {
  const numbers: number[] = [];

  const n = 10000;

  for (let i = 0; i < n; i++) {
    numbers.push(generateRandomTwo(1, 1));
  }

  const countTable: { [key: number]: number } = {};

  for (const number of numbers) {
    const index = Math.round(number);

    countTable[index] = (countTable[index] || 0) + 1;
  }

  const freqTable = Object.entries(countTable)
    .map((item) => ({
      x: +item[0],
      y: item[1] / n,
    }))
    .sort((a, b) => a.x - b.x);

  res.json(freqTable);
});

app.listen(5000, () => {
  console.log('server started');
});
