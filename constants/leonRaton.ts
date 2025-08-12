import type { StoryGraph } from "@/components/story/StoryPlayer";

export const leonRaton: StoryGraph = {
  start: {
    id: "start",
    content:
      "Un león dormía plácidamente bajo un gran árbol. De pronto, un pequeño ratón corre por su cuerpo y lo despierta.",
    choices: [
      { text: "Atrapar al ratón", nextId: "catchMouse" },
      { text: "Dejarlo escapar", nextId: "letGo" },
    ],
  },

  catchMouse: {
    id: "catchMouse",
    content:
      "El león atrapa al ratón con su gran garra. El ratón, temblando, le pide que lo perdone y promete ayudarlo algún día.",
    choices: [
      { text: "Perdonarlo", nextId: "letGo" },
      { text: "Comérselo", nextId: "finalEat" },
    ],
  },

  letGo: {
    id: "letGo",
    content:
      "El león deja ir al ratón, pensando que un animal tan pequeño nunca podría ayudarle. Días después, el león cae en una trampa de cazadores.",
    choices: [
      { text: "Rugir pidiendo ayuda", nextId: "callForHelp" },
      { text: "Intentar romper la red solo", nextId: "tryAlone" },
    ],
  },

  callForHelp: {
    id: "callForHelp",
    content:
      "El ratón escucha los rugidos y corre hacia el león. Comienza a roer las cuerdas de la red.",
    choices: [
      { text: "Agradecerle", nextId: "finalFree" },
      { text: "Seguir rugiendo", nextId: "finalFree" },
    ],
  },

  tryAlone: {
    id: "tryAlone",
    content:
      "El león lucha con fuerza, pero las cuerdas son demasiado resistentes. Sin embargo, el ratón aparece y comienza a ayudarlo.",
    choices: [
      { text: "Agradecerle", nextId: "finalFree" },
      { text: "Seguir intentando romper la red", nextId: "finalFree" },
    ],
  },

  finalFree: {
    id: "finalFree",
    content:
      "El ratón logra liberar al león. El león, sorprendido y agradecido, comprende que incluso el más pequeño puede ayudar al más grande. Fin.",
  },

  finalEat: {
    id: "finalEat",
    content:
      "El león devora al ratón. Nunca descubre que un día ese pequeño habría podido salvarle la vida. Fin.",
  },
};
