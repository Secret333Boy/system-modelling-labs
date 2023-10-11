import generateRandomOne from '../lab1/server/generateRandomOne';
import generateRandomThree from '../lab1/server/generateRandomThree';
import generateRandomTwo from '../lab1/server/generateRandomTwo';

export default class CustomRandom {
  public static generateNormal(o: number, a: number) {
    return generateRandomTwo(o, a);
  }

  public static generateExponential(lambda: number) {
    return generateRandomOne(lambda);
  }

  public static generateUniform() {
    return generateRandomThree();
  }
}
