import Edge from './Edge';
import Vertex from './Vertex';

export default class Graph<V extends Vertex = Vertex> {
  constructor(
    private vertices: V[] = [],
    private edges: Edge<V, V>[] = []
  ) {}

  public addVertex(vertex: V) {
    this.vertices.push(vertex);
  }

  public connect<V1 extends V, V2 extends V>(
    source: V1,
    target: V2,
    weight = 1
  ) {
    if (
      this.edges.find(
        (edge) => edge.source === source && edge.target === target
      )
    ) {
      throw new Error('Tried to connect the same vertices twice');
    }

    const edge = new Edge(source, target, weight);

    source.addOutgoingEdge(edge);
    this.edges.push(edge);
  }
}
