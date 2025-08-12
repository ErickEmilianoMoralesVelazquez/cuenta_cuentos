import type { StoryGraph } from "@/components/story/StoryPlayer";

export const exampleForest: StoryGraph = {
  start: {
    id: "start",
    content:
      "Te despiertas en un bosque brillante. Un sendero se divide en dos. A la izquierda, calma; a la derecha, escuchas risas lejanas...",
    choices: [
      { text: "Tomar el sendero izquierdo", nextId: "left1" },
      { text: "Ir por la derecha", nextId: "right1" },
    ],
  },
  left1: {
    id: "left1",
    content:
      "Avanzas por el sendero tranquilo y encuentras una señal de madera con símbolos extraños.",
    choices: [
      { text: "Seguir la señal", nextId: "left2A" },
      { text: "Ignorarla y continuar", nextId: "left2B" },
    ],
  },
  right1: {
    id: "right1",
    content:
      "Sigues las risas y hallas un claro con luciérnagas. Una figura con capa te saluda.",
    choices: [
      { text: "Saludar a la figura", nextId: "right2A" },
      { text: "Ocultarte y observar", nextId: "right2B" },
    ],
  },
  left2A: {
    id: "left2A",
    content:
      "La señal te guía a un puente de piedra sobre un río esmeralda que susurra tu nombre.",
    choices: [
      { text: "Cruzar el puente", nextId: "finalA1" },
      { text: "Bordear el río", nextId: "finalA2" },
    ],
  },
  left2B: {
    id: "left2B",
    content:
      "Ignoras la señal y descubres un árbol hueco que parece invitarte a entrar.",
    choices: [
      { text: "Entrar al árbol", nextId: "finalB1" },
      { text: "Rodearlo con cuidado", nextId: "finalB2" },
    ],
  },
  right2A: {
    id: "right2A",
    content:
      "La figura ríe y te ofrece una moneda brillante: 'cara, guía; cruz, misterio'.",
    choices: [
      { text: "Elegir cara", nextId: "finalC1" },
      { text: "Elegir cruz", nextId: "finalC2" },
    ],
  },
  right2B: {
    id: "right2B",
    content:
      "Desde las sombras ves un mapa grabado en una roca, marcado con una X.",
    choices: [
      { text: "Seguir el mapa", nextId: "finalD1" },
      { text: "Confiar en tu instinto", nextId: "finalD2" },
    ],
  },
  finalA1: { id: "finalA1", content: "Cruzas el puente y el río te bendice con un camino dorado. Fin." },
  finalA2: { id: "finalA2", content: "Bordeas el río y una barca te lleva a casa. Fin." },
  finalB1: { id: "finalB1", content: "Dentro del árbol, un guardián te nombra Protector del Bosque. Fin." },
  finalB2: { id: "finalB2", content: "Rodeas el árbol y hallas un claro de descanso eterno. Fin." },
  finalC1: { id: "finalC1", content: "Cara: una estrella te guía al castillo de cristal. Fin." },
  finalC2: { id: "finalC2", content: "Cruz: un sendero secreto revela viejos amigos. Fin." },
  finalD1: { id: "finalD1", content: "Sigues la X y recuperas un tesoro olvidado. Fin." },
  finalD2: { id: "finalD2", content: "Tu instinto te lleva a la salida del bosque. Fin." },
};
