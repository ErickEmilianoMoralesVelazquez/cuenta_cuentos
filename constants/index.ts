import type { StoryGraph } from "@/components/story/StoryPlayer";
import { exampleForest } from "./exampleForest";
import {leonRaton} from './leonRaton';

export const storyRegistry: Record<string, StoryGraph> = {
  forest: exampleForest,
  leon_raton: leonRaton,
  // aquí vas agregando más: "leonRaton": leonRatonGraph, etc.
};
