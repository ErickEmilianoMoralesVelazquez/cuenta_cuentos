import type { StoryGraph } from "@/components/story/StoryPlayer";

export const exampleTwo: StoryGraph = {
  start: {
    id: "start",
    content:
      "Es medianoche en la ciudad. Un mensaje anónimo llega a tu teléfono: 'Si quieres la verdad, ve al muelle 14'.",
    choices: [
      { text: "Ir al muelle 14", nextId: "dock1" },
      { text: "Ignorar el mensaje y quedarte en casa", nextId: "home1" },
    ],
  },
  dock1: {
    id: "dock1",
    content:
      "El muelle está desierto, salvo por un maletín apoyado contra una farola parpadeante.",
    choices: [
      { text: "Abrir el maletín", nextId: "dock2A" },
      { text: "Observar desde la distancia", nextId: "dock2B" },
    ],
  },
  home1: {
    id: "home1",
    content:
      "Intentas dormir, pero escuchas pasos afuera. Alguien toca la puerta tres veces.",
    choices: [
      { text: "Abrir la puerta", nextId: "home2A" },
      { text: "Mirar por la mirilla", nextId: "home2B" },
    ],
  },
  dock2A: {
    id: "dock2A",
    content:
      "Dentro hay fotos tuyas vigilándote durante semanas. Un sobre tiene la dirección de un almacén.",
    choices: [
      { text: "Ir al almacén", nextId: "finalA1" },
      { text: "Quemar las pruebas", nextId: "finalA2" },
    ],
  },
  dock2B: {
    id: "dock2B",
    content:
      "Ves a un hombre con sombrero acercarse. Susurra tu nombre y desaparece en la niebla.",
    choices: [
      { text: "Seguirlo", nextId: "finalB1" },
      { text: "Quedarte quieto", nextId: "finalB2" },
    ],
  },
  home2A: {
    id: "home2A",
    content:
      "Un desconocido empapado te entrega una llave antigua y se marcha sin decir palabra.",
    choices: [
      { text: "Probar la llave en tu casa", nextId: "finalC1" },
      { text: "Guardarla para más tarde", nextId: "finalC2" },
    ],
  },
  home2B: {
    id: "home2B",
    content:
      "Por la mirilla ves un sobre rojo. Dentro, una foto tuya en el muelle 14.",
    choices: [
      { text: "Ir al muelle", nextId: "finalD1" },
      { text: "Llamar a la policía", nextId: "finalD2" },
    ],
  },
  finalA1: { id: "finalA1", content: "El almacén revela un centro de vigilancia clandestino. Tu nombre está en la lista. Fin." },
  finalA2: { id: "finalA2", content: "Quemaste el maletín, pero una sombra te observa desde un tejado. Fin." },
  finalB1: { id: "finalB1", content: "Lo sigues hasta un túnel donde desaparece frente a tus ojos. Fin." },
  finalB2: { id: "finalB2", content: "La figura se esfuma y quedas con más preguntas que respuestas. Fin." },
  finalC1: { id: "finalC1", content: "La llave abre una puerta secreta en tu sótano. Dentro, cajas con archivos de tu vida. Fin." },
  finalC2: { id: "finalC2", content: "Guardas la llave, pero al día siguiente ha desaparecido. Fin." },
  finalD1: { id: "finalD1", content: "El muelle está vacío, salvo por un teléfono que empieza a sonar. Fin." },
  finalD2: { id: "finalD2", content: "La policía llega, pero no encuentra nada. Solo queda el sobre rojo. Fin." },
};
