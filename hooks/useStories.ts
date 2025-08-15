import type { StoryGraph } from '@/components/story/StoryPlayer';
import { apiService, type BackendStory, type BackendStoryDetail } from '@/lib/apiService';
import { useEffect, useState } from 'react';

export interface UnifiedStory {
  id: number;
  title: string;
  image?: string;
  description: string;
  duration?: string;
  category?: string;
}

export const useStories = () => {
  const [stories, setStories] = useState<UnifiedStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Obteniendo historias del backend...');
      const backendStories = await apiService.getStories();
      
      // Convertir BackendStory a UnifiedStory
      const convertedStories: UnifiedStory[] = backendStories.map(story => ({
        id: story.id,
        title: story.title,
        description: story.description,
        image: story.image,
        duration: story.duration,
        category: story.category,
      }));
      
      setStories(convertedStories);
      console.log('✅ Historias obtenidas:', convertedStories.length);
    } catch (err) {
      console.error('Error fetching stories:', err);
      setError('Error al cargar las historias');
    } finally {
      setLoading(false);
    }
  };

  const getStoryDetail = async (storyId: number): Promise<BackendStoryDetail> => {
    try {
      console.log(`🔄 Obteniendo detalle de historia: ${storyId}`);
      const storyDetail = await apiService.getStoryDetail(storyId);
      console.log(`✅ Detalle obtenido para historia: ${storyId}`);
      return storyDetail;
    } catch (err) {
      console.error('Error fetching story detail:', err);
      throw new Error('Error al cargar los detalles de la historia');
    }
  };

  const retryFetch = () => {
    fetchStories();
  };

  return {
    stories,
    loading,
    error,
    getStoryDetail,
    retryFetch,
  };
};