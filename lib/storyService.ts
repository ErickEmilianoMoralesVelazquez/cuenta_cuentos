import { apiService } from './apiService';
import type { StoryGraph } from '@/components/story/StoryPlayer';
import type { UnifiedStory } from '@/hooks/useStories';

export interface StoryMetadata {
  title: string;
  image: string;
  duration: string;
  category: string;
}

class StoryService {
  private cachedStories: UnifiedStory[] | null = null;
  private storyGraphCache = new Map<string, StoryGraph>();

  /**
   * Obtiene todas las historias del backend
   */
  async getAllStories(): Promise<UnifiedStory[]> {
    try {
      console.log('🔄 Obteniendo historias del backend...');
      const backendStories = await apiService.getUnifiedStories();
      console.log('✅ Historias obtenidas:', backendStories.length);
      this.cachedStories = backendStories;
      return backendStories;
    } catch (error) {
      console.error('❌ Error obteniendo historias del backend:', error);
      
      // Si es un error de red, dar un mensaje más específico
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Error de conexión. Verifica tu conexión a internet.');
      }
      
      throw new Error('No se pudieron obtener las historias. Verifica tu conexión.');
    }
  }

  /**
   * Obtiene un grafo de historia por storyKey del backend
   */
  async getStoryGraph(storyKey: string): Promise<{ graph: StoryGraph; metadata: StoryMetadata }> {
    // Verificar cache primero
    if (this.storyGraphCache.has(storyKey)) {
      const graph = this.storyGraphCache.get(storyKey)!;
      const metadata = await this.getStoryMetadata(storyKey);
      return { graph, metadata };
    }

    try {
      console.log(`🔄 Obteniendo grafo de historia: ${storyKey}`);
      const response = await apiService.getStoryGraph(storyKey);
      const graph = response.graph;
      const metadata = response.metadata;
      
      // Cachear el resultado
      this.storyGraphCache.set(storyKey, graph);
      console.log(`✅ Grafo obtenido para: ${storyKey}`);
      
      return { graph, metadata };
    } catch (error) {
      console.error(`❌ Error obteniendo grafo de historia ${storyKey}:`, error);
      throw new Error(`No se pudo obtener la historia: ${storyKey}`);
    }
  }

  /**
   * Obtiene metadatos de una historia
   */
  private async getStoryMetadata(storyKey: string): Promise<StoryMetadata> {
    if (this.cachedStories) {
      const story = this.cachedStories.find(s => s.storyKey === storyKey);
      if (story) {
        return {
          title: story.title,
          image: story.image,
          duration: story.duration,
          category: story.category,
        };
      }
    }

    throw new Error(`Metadatos no encontrados para: ${storyKey}`);
  }

  /**
   * Limpia el cache (útil para refrescar datos)
   */
  clearCache(): void {
    console.log('🧹 Limpiando cache...');
    this.cachedStories = null;
    this.storyGraphCache.clear();
  }

  /**
   * Verifica si una historia requiere sesión en el backend
   */
  async requiresBackendSession(storyKey: string): Promise<boolean> {
    try {
      if (!this.cachedStories) {
        await this.getAllStories();
      }
      
      const story = this.cachedStories?.find(s => s.storyKey === storyKey);
      return story?.type === 'story';
    } catch {
      return false;
    }
  }

  /**
   * Obtiene el originalId de una historia por storyKey
   */
  async getOriginalId(storyKey: string): Promise<number | undefined> {
    try {
      if (!this.cachedStories) {
        await this.getAllStories();
      }
      
      const story = this.cachedStories?.find(s => s.storyKey === storyKey);
      return story?.originalId;
    } catch {
      return undefined;
    }
  }

  /**
   * Obtiene el tipo de una historia por storyKey
   */
  async getStoryType(storyKey: string): Promise<'cuento' | 'story' | null> {
    try {
      if (!this.cachedStories) {
        await this.getAllStories();
      }
      
      const story = this.cachedStories?.find(s => s.storyKey === storyKey);
      return (story?.type as 'cuento' | 'story') || null;
    } catch {
      return null;
    }
  }
}

export const storyService = new StoryService();