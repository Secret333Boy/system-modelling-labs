import express, { Request, Response } from 'express';
import cors from 'cors';
import generateRandomOne from './generateRandomOne';
import generateRandomTwo from './generateRandomTwo';
import generateRandomThree from './generateRandomThree';

const k = 20;

const app = express();

app.use(cors());

const testGenerator =
  (generate: () => number) => (req: Request, res: Response) => {
    const numbers: number[] = [];

    const n = 10000;

    for (let i = 0; i < n; i++) {
      numbers.push(generate());
    }

    const max = Math.max(...numbers);
    const min = Math.min(...numbers);

    const h = (max - min) / k;

    const countTable: { [key: number]: number } = {};

    const i0 = min;
    const iend = max;

    // eslint-disable-next-line for-direction
    for (let i = i0; i < iend; i += h) {
      const index = i + h / 2;
      countTable[index] = numbers.filter(
        (num) => num >= i && num <= i + h
      ).length;
    }

    const freqTable = Object.entries(countTable)
      .map((item) => ({
        x: +item[0],
        y: item[1],
      }))
      .sort((a, b) => a.x - b.x);

    res.json(freqTable);
  };

app.get(
  '/one',
  testGenerator(() => generateRandomOne(1))
);

app.get(
  '/two',
  testGenerator(() => generateRandomTwo(1, 1))
);

app.get(
  '/three',
  testGenerator(() => generateRandomThree())
);

app.listen(5000, () => {
  console.log('server started');
});
