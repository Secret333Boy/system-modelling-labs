import express, { Request, Response } from 'express';
import cors from 'cors';
import generateRandomOne from './generateRandomOne';
import generateRandomTwo from './generateRandomTwo';
import generateRandomThree from './generateRandomThree';
import gauss from './gauss';
import exponential from './exponential';
import exponentialSegment from './exponentialSegment';

const k = 100;

const app = express();

app.use(cors());

const testGenerator =
  (generate: () => number, testFunc: (x1: number, x2: number) => number) =>
  (req: Request, res: Response) => {
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

    for (let m = 0; m < k; m++) {
      const i = i0 + m * h;

      const index = i + h / 2;
      countTable[index] = numbers.filter(
        (num) => num >= i && num < i + h
      ).length;
    }

    const freqTable = Object.entries(countTable)
      .map((item) => ({
        x: +item[0],
        y: item[1],
      }))
      .sort((a, b) => a.x - b.x);

    let X2 = 0;
    let X2k = 0;
    let M = 0;
    let M2 = 0;

    console.table(
      freqTable.map(({ x, y }) => {
        const yExpected = testFunc(x - h / 2, x + h / 2) * n;
        const X2part =
          y >= 5 ? ((y - yExpected) * (y - yExpected)) / yExpected : 0;

        X2 += X2part;
        if (y >= 5) X2k++;

        const freq = y / n;

        M += x * freq;
        M2 += x * x * freq;

        return { x, yGot: y, yExpected, diff: Math.abs(yExpected - y), X2part };
      })
    );

    console.log(`M=${M}\nD=${M2 - M * M}\nX2 (k=${X2k}) = ${X2}`);

    res.json(freqTable);
  };

app.get(
  '/one',
  testGenerator(() => generateRandomOne(1), exponentialSegment(1))
);

app.get(
  '/two',
  testGenerator(
    () => generateRandomTwo(1, 1),
    () => 0
  )
);

app.get(
  '/three',
  testGenerator(
    () => generateRandomThree(),
    () => 1 / k
  )
);

app.listen(5000, () => {
  console.log('server started');
});
