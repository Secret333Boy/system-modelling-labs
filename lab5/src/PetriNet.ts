import Place from './Place';
import Transition from './Transition';
import Graph from './graph/Graph';

export default class PetriNet extends Graph<Place | Transition> {
  public connect<V1 extends Place | Transition, V2 extends Place | Transition>(
    source: V1,
    target: V2,
    weight?: number
  ): void {}
}
