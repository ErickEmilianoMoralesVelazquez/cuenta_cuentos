// lib/config.ts
// Configuración centralizada para el backend
import * as SecureStore from 'expo-secure-store';

export const BACKEND_CONFIG = {
  // 🔧 Cambia esta URL cuando ngrok genere una nueva
  BASE_URL: 'https://b9de05143a5b.ngrok-free.app',
  API_BASE_URL: 'https://b9de05143a5b.ngrok-free.app/api',
  
  // Endpoints
  ENDPOINTS: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    STORIES: '/api/stories',
    STORY_DETAIL: '/api/stories', // Se concatenará con /:id
    UNIFIED_STORIES: '/api/unified-stories',
    STORY_GRAPH: '/api/unified-stories/graph',
    START_STORY: '/api/stories/start',
    MAKE_CHOICE: '/api/stories/choice',
    USER_SESSIONS: '/api/stories/sessions',
  },
  
  // Timeouts
  TIMEOUTS: {
    REQUEST: 10000, // 10 segundos
    SESSION: 300000, // 5 minutos
  },
  
  // Configuración de historias
  STORIES: {
    MAX_CACHE_SIZE: 50,
    CACHE_TTL: 300000, // 5 minutos
  }
};

// Función para obtener la URL completa de un endpoint
export const getApiUrl = (endpoint: string): string => {
  return `${BACKEND_CONFIG.BASE_URL}${endpoint}`;
};

// Función para obtener headers de autenticación
export const getAuthHeaders = async (): Promise<Record<string, string>> => {
  try {
    const token = await SecureStore.getItemAsync('token');
    
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  } catch (error) {
    console.warn('Error obteniendo token de autenticación:', error);
    return {
      'Content-Type': 'application/json',
    };
  }
};