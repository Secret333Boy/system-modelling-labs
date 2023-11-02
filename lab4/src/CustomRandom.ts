import generateRandomOne from '../../lab1/src/server/generateRandomOne';
import generateRandomThree from '../../lab1/src/server/generateRandomThree';
import generateRandomTwo from '../../lab1/src/server/generateRandomTwo';

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

  public static generateErlang(a: number, k: number) {
    let multEps = 1;

    for (let i = 0; i < k; i++) {
      multEps *= Math.random();
    }

    return -Math.log(multEps) / (k * a);
  }
}
