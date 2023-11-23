import Edge from './Edge';

export default class Vertex<P = unknown> {
  private outgoingEdges = new Set<Edge<Vertex<P>>>();

  constructor(private payload: P) {}

  public setPayload(payload: P) {
    this.payload = payload;
  }

  public getPayload() {
    return this.payload;
  }

  public getOutgoingEdges() {
    return this.outgoingEdges.values();
  }

  public addOutgoingEdge(edge: Edge<Vertex<P>>) {
    this.outgoingEdges.add(edge);
  }

  public getNextVertices() {
    const vertices: { vertex: Vertex; weight: number }[] = [];

    for (const edge of this.outgoingEdges) {
      vertices.push({ vertex: edge.target, weight: edge.weight });
    }

    return vertices;
  }
}
