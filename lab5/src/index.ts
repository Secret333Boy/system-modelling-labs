import PetriNet from './PetriNet';
import Place from './Place';
import Graph from './graph/Graph';
import Vertex from './graph/Vertex';

const petriNet = new PetriNet();

const pl1 = new Place({ counter: 0 });
const pl2 = new Place({ counter: 0 });

petriNet.connect(pl1, pl2);
