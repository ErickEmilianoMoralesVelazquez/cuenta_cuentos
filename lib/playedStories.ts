// lib/playedStories.ts
import * as SecureStore from "expo-secure-store";

export type PlayedStory = {
  id: string;                 // uuid simple
  storyKey: string;
  title: string;
  image?: string;
  finishedAtISO: string;      // fecha fin
  progress: number;           // 0-100
  decisions: string[];        // textos elegidos (3)
  endingId: string;           // id del nodo final
  endingText: string;         // texto final mostrado
};

const KEY = "playedStories";

export async function getPlayedStories(): Promise<PlayedStory[]> {
  const raw = await SecureStore.getItemAsync(KEY);
  if (!raw) return [];
  try { return JSON.parse(raw) as PlayedStory[]; } catch { return []; }
}

export async function addPlayedStory(item: PlayedStory) {
  const list = await getPlayedStories();
  const updated = [item, ...list].slice(0, 50); // limita a 50
  await SecureStore.setItemAsync(KEY, JSON.stringify(updated));
}

export async function clearPlayedStories() {
  await SecureStore.deleteItemAsync(KEY);
}

export async function getPlayedStoryById(id: string) {
  const list = await getPlayedStories();
  return list.find(x => x.id === id);
}

export async function removePlayedStory(id: string) {
  const list = await getPlayedStories();
  const updated = list.filter(x => x.id !== id);
  await SecureStore.setItemAsync(KEY, JSON.stringify(updated));
  return updated;
}
