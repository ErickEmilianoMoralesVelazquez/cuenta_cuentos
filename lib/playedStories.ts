// lib/playedStories.ts
import * as SecureStore from "expo-secure-store";
import { apiService } from "./apiService";

export type PlayedStory = {
  id: string;                 // ID del backend
  storyKey: string;
  title: string;
  image?: string;
  finishedAtISO: string;      // fecha fin
  progress: number;           // 0-100
  decisions: string[];        // textos elegidos
  endingId: string;           // id del nodo final
  endingText: string;         // texto final mostrado
};

const LOCAL_STORAGE_KEY = "playedStoriesLocal";

/**
 * Obtiene el ID del usuario actual para hacer el almacenamiento específico por usuario
 */
async function getCurrentUserId(): Promise<string> {
  try {
    const userJson = await SecureStore.getItemAsync('user');
    if (userJson) {
      const user = JSON.parse(userJson);
      // Usar ID si está disponible, sino email, sino 'anonymous'
      const userId = user.id?.toString() || user.email || 'anonymous';
      
      // Limpiar la clave para que sea válida para SecureStore
      // Solo permite alfanuméricos, ".", "-", y "_"
      const cleanUserId = userId
        .replace(/[^a-zA-Z0-9._-]/g, '_') // Reemplazar caracteres inválidos con _
        .replace(/^[^a-zA-Z]/, 'user_') // Si empieza con número, agregar 'user_' al inicio
        .substring(0, 50); // Limitar longitud
      
      console.log(`👤 Usuario identificado: ${userId} -> ${cleanUserId}`);
      return cleanUserId;
    }
  } catch (error) {
    console.log('⚠️ Error obteniendo usuario:', error);
  }
  return 'anonymous';
}

/**
 * Obtiene la clave específica para el usuario actual
 */
async function getUserSpecificKey(): Promise<string> {
  const userId = await getCurrentUserId();
  return `${LOCAL_STORAGE_KEY}_${userId}`;
}

/**
 * Obtiene todas las historias jugadas (backend + local como fallback)
 */
export async function getPlayedStories(): Promise<PlayedStory[]> {
  try {
    // Intentar obtener del backend (ahora no arroja errores)
    const response = await apiService.getUserSessions();
    
    // Si hay sesiones del backend, usarlas
    if (response.sessions && response.sessions.length > 0) {
      console.log('✅ Usando historial del backend:', response.sessions.length, 'sesiones');
      
      const backendStories: PlayedStory[] = response.sessions.map(session => ({
        id: `backend_${session.id}`,
        storyKey: `story_${session.story.id}`,
        title: session.story.title,
        image: session.story.image,
        finishedAtISO: session.createdAt,
        progress: session.status === 'finished' ? 100 : 50,
        decisions: session.choices.map(choice => choice.choice_text),
        endingId: session.choices[session.choices.length - 1]?.to_node_id || "end",
        endingText: "Historia completada en el backend",
      }));
      
      return backendStories;
    } else {
      // Si no hay sesiones del backend, usar local
      console.log('📝 No hay sesiones del backend, usando almacenamiento local');
      return await getLocalStories();
    }
  } catch (error: any) {
    // Error general, usar local como fallback
    console.log('📝 Error general, usando almacenamiento local');
    return await getLocalStories();
  }
}

/**
 * Agregar historia jugada (guarda localmente si no hay backend)
 */
export async function addPlayedStory(item: PlayedStory) {
  try {
    // Siempre guardar localmente por ahora
    await saveLocalStory(item);
    console.log("✅ Historia guardada localmente:", item.title);
    
    // TODO: Cuando implementes el endpoint de guardado en el backend,
    // aquí puedes agregar la lógica para guardar también en el servidor
  } catch (error) {
    console.log("⚠️ Error guardando historia:", error);
  }
}

/**
 * Limpiar historias jugadas
 */
export async function clearPlayedStories() {
  try {
    // Limpiar local del usuario actual
    const userKey = await getUserSpecificKey();
    await SecureStore.deleteItemAsync(userKey);
    console.log("🧹 Historias locales limpiadas para el usuario actual");
    
    // TODO: Implementar limpieza en el backend cuando esté listo
  } catch (error) {
    console.log("⚠️ Error limpiando historias:", error);
  }
}

/**
 * Obtener historia por ID
 */
export async function getPlayedStoryById(id: string) {
  try {
    const list = await getPlayedStories();
    return list.find(x => x.id === id);
  } catch (error) {
    console.log("⚠️ Error obteniendo historia por ID:", error);
    return undefined;
  }
}

/**
 * Remover historia por ID
 */
export async function removePlayedStory(id: string) {
  try {
    // Remover de local del usuario actual
    const localStories = await getLocalStories();
    const updatedStories = localStories.filter(story => story.id !== id);
    
    const userKey = await getUserSpecificKey();
    await SecureStore.setItemAsync(userKey, JSON.stringify(updatedStories));
    
    console.log("🗑️ Historia removida:", id);
    
    // Retornar la lista actualizada
    return await getPlayedStories();
  } catch (error) {
    console.log("⚠️ Error removiendo historia:", error);
    // Retornar lista vacía en caso de error
    return [];
  }
}

// Funciones auxiliares para almacenamiento local
async function getLocalStories(): Promise<PlayedStory[]> {
  try {
    const userKey = await getUserSpecificKey();
    console.log(`🔍 Buscando historias con clave: ${userKey}`);
    const data = await SecureStore.getItemAsync(userKey);
    if (data) {
      const stories = JSON.parse(data);
      console.log(`📚 Encontradas ${stories.length} historias locales`);
      return stories;
    }
    console.log('📚 No hay historias locales guardadas');
    return [];
  } catch (error) {
    console.log("⚠️ Error obteniendo historias locales:", error);
    return [];
  }
}

async function saveLocalStory(story: PlayedStory): Promise<void> {
  try {
    const existingStories = await getLocalStories();
    const updatedStories = [story, ...existingStories].slice(0, 50); // Limitar a 50 historias
    
    const userKey = await getUserSpecificKey();
    await SecureStore.setItemAsync(userKey, JSON.stringify(updatedStories));
    
    console.log(`✅ Historia guardada para usuario: ${await getCurrentUserId()}`);
  } catch (error) {
    console.log("⚠️ Error guardando historia local:", error);
    // No arrojamos el error, solo lo registramos
  }
}
