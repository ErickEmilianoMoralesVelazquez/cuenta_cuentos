import type { StoryGraph } from "@/components/story/StoryPlayer";
import { exampleForest } from "./exampleForest";
import {leonRaton} from './leonRaton';
import { exampleTwo } from "./exampleTwo";
import { exampleThree } from "./exampleThree";

export const storyRegistry: Record<string, StoryGraph> = {
  forest: exampleForest,
  leon_raton: leonRaton,
  three: exampleThree,
  two: exampleTwo,
  // aquí vas agregando más: "leonRaton": leonRatonGraph, etc.
};
