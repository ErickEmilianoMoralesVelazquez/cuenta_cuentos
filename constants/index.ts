import type { StoryGraph } from "@/components/story/StoryPlayer";
import { exampleForest } from "./exampleForest";

export const storyRegistry: Record<string, StoryGraph> = {
  forest: exampleForest,
  // aquí vas agregando más: "leonRaton": leonRatonGraph, etc.
};
