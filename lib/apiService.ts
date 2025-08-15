import { BACKEND_CONFIG, getApiUrl, getAuthHeaders } from './config';

interface APIStory {
  id: string;
  title: string;
  image: string;
  description: string;
  duration: string;
  category: string;
  storyKey: string;
  type: 'cuento' | 'story';
  originalId: number;
}

interface BackendStory {
  id: number;
  title: string;
  description: string;
  image?: string;
  category?: string;
  duration?: string;
}

interface BackendStoryDetail extends BackendStory {
  startNodeId: string;
  graph: {
    [nodeId: string]: {
      id: string;
      content: string;
      choices: {
        text: string;
        nextId: string;
      }[];
    };
  };
}

interface StoryGraphResponse {
  message: string;
  storyKey: string;
  type: string;
  graph: Record<string, any>;
  metadata: {
    title: string;
    image: string;
    duration: string;
    category: string;
  };
}

interface SessionResponse {
  message: string;
  session: {
    id: number;
    story: {
      id: number;
      title: string;
      description: string;
    };
    currentNode: {
      id: string;
      content: string;
      isEnding: boolean;
      choices: {
        id: number;
        text: string;
        nextNodeId: string;
      }[];
    };
  };
}

interface ChoiceResponse {
  message: string;
  choice: {
    text: string;
    fromNodeId: string;
    toNodeId: string;
  };
  nextNode?: {
    id: string;
    content: string;
    isEnding: boolean;
    choices: {
      id: number;
      text: string;
      nextNodeId: string;
    }[];
  };
  ending?: string;
  storyFinished?: boolean;
}

interface UserSessionsResponse {
  message: string;
  sessions: {
    id: number;
    status: string;
    createdAt: string;
    story: {
      id: number;
      title: string;
      image: string;
    };
    choices: {
      choice_text: string;
      from_node_id: string;
      to_node_id: string;
    }[];
  }[];
}

class APIService {
  async getStories(): Promise<BackendStory[]> {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(getApiUrl(BACKEND_CONFIG.ENDPOINTS.STORIES), {
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.stories || data;
    } catch (error) {
      console.error('Error fetching stories:', error);
      throw error;
    }
  }

  async getStoryDetail(storyId: number): Promise<BackendStoryDetail> {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(getApiUrl(`${BACKEND_CONFIG.ENDPOINTS.STORY_DETAIL}/${storyId}`), {
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.story || data;
    } catch (error) {
      console.error('Error fetching story detail:', error);
      throw error;
    }
  }

  async getUnifiedStories(): Promise<APIStory[]> {
    try {
      // Este endpoint no requiere autenticación según tu Postman
      const response = await fetch(getApiUrl(BACKEND_CONFIG.ENDPOINTS.UNIFIED_STORIES), {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.stories;
    } catch (error) {
      console.error('Error fetching unified stories:', error);
      throw error;
    }
  }

  async getStoryGraph(storyKey: string): Promise<StoryGraphResponse> {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(getApiUrl(`${BACKEND_CONFIG.ENDPOINTS.STORY_GRAPH}/${storyKey}`), {
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching story graph:', error);
      throw error;
    }
  }

  async startStory(storyId: number): Promise<SessionResponse> {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(getApiUrl(BACKEND_CONFIG.ENDPOINTS.START_STORY), {
        method: 'POST',
        headers,
        body: JSON.stringify({ storyId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error starting story:', error);
      throw error;
    }
  }

  async makeChoice(sessionId: number, choiceId: number): Promise<ChoiceResponse> {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(getApiUrl(BACKEND_CONFIG.ENDPOINTS.MAKE_CHOICE), {
        method: 'POST',
        headers,
        body: JSON.stringify({ sessionId, choiceId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error making choice:', error);
      throw error;
    }
  }

  async getUserSessions(): Promise<UserSessionsResponse> {
    try {
      const headers = await getAuthHeaders();
      const url = getApiUrl(BACKEND_CONFIG.ENDPOINTS.USER_SESSIONS);
      console.log('🔄 Solicitando sesiones desde:', url);
      console.log('🔄 Headers:', headers);
      
      const response = await fetch(url, {
        headers,
      });

      console.log('🔄 Status de respuesta:', response.status);
      
      if (!response.ok) {
        if (response.status === 401) {
          console.error('❌ Usuario no autenticado (401). Necesitas hacer login primero.');
          throw new Error('No estás autenticado. Por favor, inicia sesión.');
        } else if (response.status === 404) {
          console.error('❌ Endpoint de sesiones no encontrado (404). El backend necesita implementar GET /api/stories/sessions');
          throw new Error('Endpoint de sesiones no implementado en el backend');
        } else {
          console.error('❌ Error en endpoint de sesiones:', response.status, response.statusText);
          const errorText = await response.text();
          console.error('❌ Respuesta del error:', errorText);
          throw new Error(`Error del servidor: ${response.status}`);
        }
      }

      const data = await response.json();
      console.log('✅ Datos de sesiones recibidos:', data);
      return data;
    } catch (err) {
      console.error('❌ Error obteniendo sesiones:', err);
      throw err;
    }
  }
}

export const apiService = new APIService();
export type { APIStory, BackendStory, BackendStoryDetail, ChoiceResponse, SessionResponse, StoryGraphResponse, UserSessionsResponse };
