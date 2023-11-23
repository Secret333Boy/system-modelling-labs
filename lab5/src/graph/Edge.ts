import Vertex from './Vertex';

export default class Edge<
  V1 extends Vertex = Vertex,
  V2 extends Vertex = Vertex,
> {
  constructor(
    public readonly source: V1,
    public readonly target: V2,
    public readonly weight = 1
  ) {}
}
