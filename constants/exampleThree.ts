import type { StoryGraph } from "@/components/story/StoryPlayer";

export const exampleThree: StoryGraph = {
  start: {
    id: "start",
    content:
      "Despiertas en una cápsula criogénica. La nave está en silencio, pero una luz roja parpadea en el panel de mando.",
    choices: [
      { text: "Revisar el panel de mando", nextId: "panel1" },
      { text: "Explorar el pasillo principal", nextId: "hall1" },
    ],
  },
  panel1: {
    id: "panel1",
    content:
      "El panel muestra una alerta: 'Fuga de oxígeno en el sector 7'.",
    choices: [
      { text: "Sellar el sector 7", nextId: "panel2A" },
      { text: "Ignorar y buscar a la tripulación", nextId: "panel2B" },
    ],
  },
  hall1: {
    id: "hall1",
    content:
      "Caminas por el pasillo y encuentras un robot de servicio bloqueando el camino.",
    choices: [
      { text: "Hablar con el robot", nextId: "hall2A" },
      { text: "Buscar un atajo", nextId: "hall2B" },
    ],
  },
  panel2A: {
    id: "panel2A",
    content:
      "Sellas el sector, pero detectas movimiento no identificado en el hangar.",
    choices: [
      { text: "Ir al hangar", nextId: "finalA1" },
      { text: "Asegurar la cabina de mando", nextId: "finalA2" },
    ],
  },
  panel2B: {
    id: "panel2B",
    content:
      "No encuentras a nadie, pero oyes pasos metálicos acercándose.",
    choices: [
      { text: "Esconderte", nextId: "finalB1" },
      { text: "Enfrentarte a lo que sea", nextId: "finalB2" },
    ],
  },
  hall2A: {
    id: "hall2A",
    content:
      "El robot dice: 'Acceso restringido. Autorízate'.",
    choices: [
      { text: "Dar código de capitán", nextId: "finalC1" },
      { text: "Hackear al robot", nextId: "finalC2" },
    ],
  },
  hall2B: {
    id: "hall2B",
    content:
      "Encuentras una compuerta de mantenimiento abierta, pero escuchas ruidos adentro.",
    choices: [
      { text: "Entrar", nextId: "finalD1" },
      { text: "Buscar otra ruta", nextId: "finalD2" },
    ],
  },
  finalA1: { id: "finalA1", content: "En el hangar descubres una nave alienígena acoplada. Fin." },
  finalA2: { id: "finalA2", content: "Aseguras la cabina, pero quedas atrapado en ella. Fin." },
  finalB1: { id: "finalB1", content: "Te escondes, pero algo te encuentra. Fin." },
  finalB2: { id: "finalB2", content: "Te enfrentas a un dron de seguridad fuera de control. Fin." },
  finalC1: { id: "finalC1", content: "El robot te reconoce como capitán y te escolta. Fin." },
  finalC2: { id: "finalC2", content: "Hackeas al robot, pero activa una alarma. Fin." },
  finalD1: { id: "finalD1", content: "Dentro hay un alienígena herido pidiendo ayuda. Fin." },
  finalD2: { id: "finalD2", content: "Encuentras una salida que lleva a la bodega. Fin." },
};
