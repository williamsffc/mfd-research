import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { SlideMetadata } from '@/types/slide';

const DEMO_PRESENTATION_ID = '00000000-0000-0000-0000-000000000001';

export function useSlideOrder() {
  const [slideOrder, setSlideOrder] = useState<SlideMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  const fetchSlideOrder = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('slides')
        .select('*')
        .eq('presentation_id', DEMO_PRESENTATION_ID)
        .is('deleted_at', null)
        .order('position', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        setSlideOrder(
          data.map((s) => ({
            id: s.id,
            presentationId: s.presentation_id,
            filePath: s.file_path,
            position: s.position,
            description: s.description ?? undefined,
            templateType: s.template_type ?? undefined,
            createdAt: s.created_at,
            updatedAt: s.updated_at,
          }))
        );
        setInitialized(true);
      }
    } catch (err) {
      console.error('Failed to fetch slide order:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSlideOrder();
  }, [fetchSlideOrder]);

  const initializeSlides = async (slides: { filePath: string; templateType: string }[]) => {
    try {
      const { data: presData } = await supabase
        .from('presentations')
        .select('id')
        .eq('id', DEMO_PRESENTATION_ID)
        .single();

      if (!presData) {
        await supabase.from('presentations').insert({
          id: DEMO_PRESENTATION_ID,
          title: 'SlideForge Demo',
          description: 'A showcase of SlideForge capabilities',
        });
      }

      const { data: existingSlides } = await supabase
        .from('slides')
        .select('id')
        .eq('presentation_id', DEMO_PRESENTATION_ID);

      if (!existingSlides || existingSlides.length === 0) {
        const slidesToInsert = slides.map((s, i) => ({
          presentation_id: DEMO_PRESENTATION_ID,
          file_path: s.filePath,
          position: i,
          template_type: s.templateType,
        }));

        await supabase.from('slides').insert(slidesToInsert);
        await fetchSlideOrder();
      }

      setInitialized(true);
    } catch (err) {
      console.error('Failed to initialize slides:', err);
    }
  };

  const reorderSlides = async (oldIndex: number, newIndex: number): Promise<string[] | null> => {
    if (slideOrder.length === 0) return null;

    const previousOrder = slideOrder.map(s => s.id);
    const newOrder = [...slideOrder];
    const [movedSlide] = newOrder.splice(oldIndex, 1);
    newOrder.splice(newIndex, 0, movedSlide);

    const updatedOrder = newOrder.map((s, i) => ({ ...s, position: i }));
    setSlideOrder(updatedOrder);

    try {
      const updates = updatedOrder.map((s) =>
        supabase.from('slides').update({ position: s.position }).eq('id', s.id)
      );
      await Promise.all(updates);
      return previousOrder;
    } catch (err) {
      console.error('Failed to reorder slides:', err);
      fetchSlideOrder();
      return null;
    }
  };

  const bulkMoveSlides = async (sourceIndices: number[], targetIndex: number): Promise<string[] | null> => {
    if (slideOrder.length === 0 || sourceIndices.length === 0) return null;
    if (sourceIndices.includes(targetIndex)) return null;

    const previousOrder = slideOrder.map(s => s.id);
    const sortedSourceIndices = [...sourceIndices].sort((a, b) => a - b);
    const slidesToMove = sortedSourceIndices.map(idx => slideOrder[idx]);
    const remainingSlides = slideOrder.filter((_, idx) => !sourceIndices.includes(idx));
    const selectedBeforeTarget = sortedSourceIndices.filter(idx => idx < targetIndex).length;
    let insertAt = Math.max(0, Math.min(targetIndex - selectedBeforeTarget, remainingSlides.length));
    
    const newOrder = [
      ...remainingSlides.slice(0, insertAt),
      ...slidesToMove,
      ...remainingSlides.slice(insertAt),
    ];

    const updatedOrder = newOrder.map((s, i) => ({ ...s, position: i }));
    setSlideOrder(updatedOrder);

    try {
      const updates = updatedOrder.map((s) =>
        supabase.from('slides').update({ position: s.position }).eq('id', s.id)
      );
      await Promise.all(updates);
      return previousOrder;
    } catch (err) {
      console.error('Failed to bulk move slides:', err);
      fetchSlideOrder();
      return null;
    }
  };

  const restoreOrder = async (slideIds: string[]): Promise<boolean> => {
    try {
      const idToSlide = new Map(slideOrder.map(s => [s.id, s]));
      const restoredOrder = slideIds
        .map(id => idToSlide.get(id))
        .filter((s): s is SlideMetadata => s !== undefined)
        .map((s, i) => ({ ...s, position: i }));

      setSlideOrder(restoredOrder);

      const updates = restoredOrder.map((s) =>
        supabase.from('slides').update({ position: s.position }).eq('id', s.id)
      );
      await Promise.all(updates);
      return true;
    } catch (err) {
      console.error('Failed to restore order:', err);
      fetchSlideOrder();
      return false;
    }
  };

  const getSlideId = (index: number): string | undefined => {
    return slideOrder[index]?.id;
  };

  const duplicateSlide = async (index: number, targetPosition?: number): Promise<string | null> => {
    const slideToDuplicate = slideOrder[index];
    if (!slideToDuplicate) return null;

    try {
      const insertPosition = targetPosition !== undefined ? targetPosition : index + 1;
      
      const tempId = `temp-${Date.now()}`;
      const newSlide: SlideMetadata = {
        id: tempId,
        presentationId: DEMO_PRESENTATION_ID,
        filePath: slideToDuplicate.filePath,
        position: insertPosition,
        description: slideToDuplicate.description,
        templateType: slideToDuplicate.templateType,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setSlideOrder((prev) => {
        const updated = prev.map((s) =>
          s.position >= insertPosition ? { ...s, position: s.position + 1 } : s
        );
        updated.splice(insertPosition, 0, newSlide);
        return updated;
      });

      const slidesToUpdate = slideOrder.filter((s) => s.position >= insertPosition);
      await Promise.all(
        slidesToUpdate.map((slide) =>
          supabase
            .from('slides')
            .update({ position: slide.position + 1 })
            .eq('id', slide.id)
        )
      );

      const { data, error } = await supabase
        .from('slides')
        .insert({
          presentation_id: DEMO_PRESENTATION_ID,
          file_path: slideToDuplicate.filePath,
          position: insertPosition,
          template_type: slideToDuplicate.templateType || '',
          description: slideToDuplicate.description || '',
        })
        .select()
        .single();

      if (error) throw error;

      setSlideOrder((prev) =>
        prev.map((s) => (s.id === tempId ? { ...s, id: data.id } : s))
      );

      return data.id;
    } catch (err) {
      console.error('Failed to duplicate slide:', err);
      await fetchSlideOrder();
      return null;
    }
  };

  const deleteSlide = async (index: number): Promise<SlideMetadata | null> => {
    const slideToDelete = slideOrder[index];
    if (!slideToDelete) return null;

    try {
      const deletedSlide = { ...slideToDelete };

      setSlideOrder((prev) => {
        const filtered = prev.filter((s) => s.id !== slideToDelete.id);
        return filtered.map((s, i) => ({ ...s, position: i }));
      });

      const { error } = await supabase
        .from('slides')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', slideToDelete.id);

      if (error) throw error;

      const remainingSlides = slideOrder.filter((s) => s.id !== slideToDelete.id);
      await Promise.all(
        remainingSlides.map((slide, i) =>
          supabase
            .from('slides')
            .update({ position: i })
            .eq('id', slide.id)
        )
      );

      return deletedSlide;
    } catch (err) {
      console.error('Failed to delete slide:', err);
      await fetchSlideOrder();
      return null;
    }
  };

  const restoreSlide = async (slideData: SlideMetadata): Promise<boolean> => {
    try {
      const restorePosition = slideData.position;
      const slidesToShift = slideOrder.filter((s) => s.position >= restorePosition);
      
      setSlideOrder((prev) => {
        const shifted = prev.map((s) =>
          s.position >= restorePosition ? { ...s, position: s.position + 1 } : s
        );
        shifted.splice(restorePosition, 0, slideData);
        return shifted;
      });

      await Promise.all(
        slidesToShift.map((slide) =>
          supabase
            .from('slides')
            .update({ position: slide.position + 1 })
            .eq('id', slide.id)
        )
      );

      const { error } = await supabase
        .from('slides')
        .update({ deleted_at: null, position: restorePosition })
        .eq('id', slideData.id);

      if (error) throw error;

      return true;
    } catch (err) {
      console.error('Failed to restore slide:', err);
      await fetchSlideOrder();
      return false;
    }
  };

  const removeDuplicatedSlide = async (slideId: string): Promise<boolean> => {
    try {
      const slideIndex = slideOrder.findIndex((s) => s.id === slideId);
      if (slideIndex === -1) return false;

      setSlideOrder((prev) => {
        const filtered = prev.filter((s) => s.id !== slideId);
        return filtered.map((s, i) => ({ ...s, position: i }));
      });

      const { error } = await supabase
        .from('slides')
        .delete()
        .eq('id', slideId);

      if (error) throw error;

      const remainingSlides = slideOrder.filter((s) => s.id !== slideId);
      await Promise.all(
        remainingSlides.map((slide, i) =>
          supabase
            .from('slides')
            .update({ position: i })
            .eq('id', slide.id)
        )
      );

      return true;
    } catch (err) {
      console.error('Failed to remove duplicated slide:', err);
      await fetchSlideOrder();
      return false;
    }
  };

  return {
    slideOrder,
    loading,
    initialized,
    initializeSlides,
    reorderSlides,
    bulkMoveSlides,
    restoreOrder,
    getSlideId,
    duplicateSlide,
    deleteSlide,
    restoreSlide,
    removeDuplicatedSlide,
  };
}
