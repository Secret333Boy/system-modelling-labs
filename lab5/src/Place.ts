import Vertex from './graph/Vertex';

export interface PlacePayload {
  counter: number;
}

export default class Place extends Vertex<PlacePayload> {}
