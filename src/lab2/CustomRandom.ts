import generateRandomOne from '../lab1/server/generateRandomOne';
import generateRandomTwo from '../lab1/server/generateRandomTwo';

export default class CustomRandom {
  public static generateNormal(o: number, a: number) {
    return generateRandomTwo(o, a);
  }

  public static generateExp(lambda: number) {
    return generateRandomOne(lambda);
  }
}
