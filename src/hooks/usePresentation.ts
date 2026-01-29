import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Presentation, SlideMetadata } from '@/types/slide';

export function usePresentation(presentationId?: string) {
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [slides, setSlides] = useState<SlideMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPresentation = useCallback(async () => {
    if (!presentationId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      const { data: presData, error: presError } = await supabase
        .from('presentations')
        .select('*')
        .eq('id', presentationId)
        .single();

      if (presError) throw presError;

      setPresentation({
        id: presData.id,
        title: presData.title,
        description: presData.description,
        createdAt: presData.created_at,
        updatedAt: presData.updated_at,
      });

      const { data: slidesData, error: slidesError } = await supabase
        .from('slides')
        .select('*')
        .eq('presentation_id', presentationId)
        .order('position', { ascending: true });

      if (slidesError) throw slidesError;

      setSlides(
        slidesData.map((s) => ({
          id: s.id,
          presentationId: s.presentation_id,
          filePath: s.file_path,
          position: s.position,
          description: s.description,
          templateType: s.template_type,
          createdAt: s.created_at,
          updatedAt: s.updated_at,
        }))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load presentation');
    } finally {
      setLoading(false);
    }
  }, [presentationId]);

  useEffect(() => {
    fetchPresentation();
  }, [fetchPresentation]);

  const reorderSlides = async (slideId: string, newPosition: number) => {
    const oldIndex = slides.findIndex((s) => s.id === slideId);
    if (oldIndex === -1) return;

    const newSlides = [...slides];
    const [movedSlide] = newSlides.splice(oldIndex, 1);
    newSlides.splice(newPosition, 0, movedSlide);

    // Update positions
    const updatedSlides = newSlides.map((s, i) => ({ ...s, position: i }));
    setSlides(updatedSlides);

    // Persist to database
    try {
      const updates = updatedSlides.map((s) =>
        supabase.from('slides').update({ position: s.position }).eq('id', s.id)
      );
      await Promise.all(updates);
    } catch (err) {
      // Revert on error
      fetchPresentation();
      console.error('Failed to reorder slides:', err);
    }
  };

  return {
    presentation,
    slides,
    loading,
    error,
    refetch: fetchPresentation,
    reorderSlides,
  };
}
