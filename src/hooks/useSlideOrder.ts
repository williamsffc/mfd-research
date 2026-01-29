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
        .is('deleted_at', null) // Only fetch non-deleted slides
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
            pendingAgentAction: s.pending_agent_action ?? false,
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
      // First check if presentation exists
      const { data: presData } = await supabase
        .from('presentations')
        .select('id')
        .eq('id', DEMO_PRESENTATION_ID)
        .single();

      if (!presData) {
        // Create demo presentation
        await supabase.from('presentations').insert({
          id: DEMO_PRESENTATION_ID,
          title: 'SlideForge Demo',
          description: 'A showcase of SlideForge capabilities',
        });
      }

      // Check if slides exist
      const { data: existingSlides } = await supabase
        .from('slides')
        .select('id')
        .eq('presentation_id', DEMO_PRESENTATION_ID);

      if (!existingSlides || existingSlides.length === 0) {
        // Insert all slides
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

  // Returns the previous order (slide IDs) for undo purposes
  const reorderSlides = async (oldIndex: number, newIndex: number): Promise<string[] | null> => {
    if (slideOrder.length === 0) return null;

    // Capture previous order for undo
    const previousOrder = slideOrder.map(s => s.id);

    // Optimistic update
    const newOrder = [...slideOrder];
    const [movedSlide] = newOrder.splice(oldIndex, 1);
    newOrder.splice(newIndex, 0, movedSlide);

    // Update positions
    const updatedOrder = newOrder.map((s, i) => ({ ...s, position: i }));
    setSlideOrder(updatedOrder);

    // Persist to database
    try {
      const updates = updatedOrder.map((s) =>
        supabase.from('slides').update({ position: s.position }).eq('id', s.id)
      );
      await Promise.all(updates);
      return previousOrder;
    } catch (err) {
      console.error('Failed to reorder slides:', err);
      // Revert on error
      fetchSlideOrder();
      return null;
    }
  };

  // Returns the previous order (slide IDs) for undo purposes
  const bulkMoveSlides = async (sourceIndices: number[], targetIndex: number): Promise<string[] | null> => {
    if (slideOrder.length === 0 || sourceIndices.length === 0) return null;
    
    // Don't do anything if we're dropping on a selected slide
    if (sourceIndices.includes(targetIndex)) return null;

    // Capture previous order for undo
    const previousOrder = slideOrder.map(s => s.id);

    const sortedSourceIndices = [...sourceIndices].sort((a, b) => a - b);
    
    // Get the slides to move (preserving their relative order)
    const slidesToMove = sortedSourceIndices.map(idx => slideOrder[idx]);
    
    // Get remaining slides (those not being moved)
    const remainingSlides = slideOrder.filter((_, idx) => !sourceIndices.includes(idx));
    
    // Calculate the insertion point in the remaining array
    // Count how many selected slides are before the target index
    const selectedBeforeTarget = sortedSourceIndices.filter(idx => idx < targetIndex).length;
    
    // The effective insertion point in remainingSlides is:
    // targetIndex minus the number of selected slides that were before it
    let insertAt = targetIndex - selectedBeforeTarget;
    
    // Clamp to valid range
    insertAt = Math.max(0, Math.min(insertAt, remainingSlides.length));
    
    // Build the new order
    const newOrder = [
      ...remainingSlides.slice(0, insertAt),
      ...slidesToMove,
      ...remainingSlides.slice(insertAt),
    ];

    // Update positions
    const updatedOrder = newOrder.map((s, i) => ({ ...s, position: i }));
    setSlideOrder(updatedOrder);

    // Persist to database
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

  // Restore slides to a specific order (for undo)
  const restoreOrder = async (slideIds: string[]): Promise<boolean> => {
    try {
      // Build the new order based on the provided IDs
      const idToSlide = new Map(slideOrder.map(s => [s.id, s]));
      const restoredOrder = slideIds
        .map(id => idToSlide.get(id))
        .filter((s): s is SlideMetadata => s !== undefined)
        .map((s, i) => ({ ...s, position: i }));

      // Optimistic update
      setSlideOrder(restoredOrder);

      // Persist to database
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

  const addWIPSlide = async (description?: string): Promise<string | null> => {
    try {
      const newPosition = slideOrder.length;
      const { data, error } = await supabase
        .from('slides')
        .insert({
          presentation_id: DEMO_PRESENTATION_ID,
          file_path: 'src/slides/WIPSlide.tsx',
          position: newPosition,
          template_type: 'wip',
          description: description || '',
          pending_agent_action: true, // New WIP slides need agent to generate content
        })
        .select()
        .single();

      if (error) throw error;

      // Add to local state
      const newSlide: SlideMetadata = {
        id: data.id,
        presentationId: data.presentation_id,
        filePath: data.file_path,
        position: data.position,
        description: data.description ?? undefined,
        templateType: data.template_type ?? undefined,
        pendingAgentAction: data.pending_agent_action ?? false,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };

      setSlideOrder((prev) => [...prev, newSlide]);
      return data.id;
    } catch (err) {
      console.error('Failed to add WIP slide:', err);
      return null;
    }
  };

  const updateSlideDescription = async (slideId: string, description: string) => {
    try {
      await supabase
        .from('slides')
        .update({ description }) // Only update description, keep template_type as 'wip'
        .eq('id', slideId);

      setSlideOrder((prev) =>
        prev.map((s) =>
          s.id === slideId ? { ...s, description } : s
        )
      );
    } catch (err) {
      console.error('Failed to update slide description:', err);
    }
  };

  const duplicateSlide = async (index: number, targetPosition?: number): Promise<string | null> => {
    const slideToDuplicate = slideOrder[index];
    if (!slideToDuplicate) return null;

    try {
      // If targetPosition is provided, insert there; otherwise insert after the source slide
      const insertPosition = targetPosition !== undefined ? targetPosition : index + 1;
      
      // Duplicated slides always need agent attention
      const shouldBePending = true;
      
      // Optimistic UI update first
      const tempId = `temp-${Date.now()}`;
      const newSlide: SlideMetadata = {
        id: tempId,
        presentationId: DEMO_PRESENTATION_ID,
        filePath: slideToDuplicate.filePath,
        position: insertPosition,
        description: slideToDuplicate.description,
        templateType: slideToDuplicate.templateType,
        pendingAgentAction: shouldBePending,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Update local state immediately
      setSlideOrder((prev) => {
        const updated = prev.map((s) =>
          s.position >= insertPosition ? { ...s, position: s.position + 1 } : s
        );
        updated.splice(insertPosition, 0, newSlide);
        return updated;
      });

      // Batch update positions using Promise.all
      const slidesToUpdate = slideOrder.filter((s) => s.position >= insertPosition);
      await Promise.all(
        slidesToUpdate.map((slide) =>
          supabase
            .from('slides')
            .update({ position: slide.position + 1 })
            .eq('id', slide.id)
        )
      );

      // Insert the duplicated slide
      const { data, error } = await supabase
        .from('slides')
        .insert({
          presentation_id: DEMO_PRESENTATION_ID,
          file_path: slideToDuplicate.filePath,
          position: insertPosition,
          template_type: slideToDuplicate.templateType || '',
          description: slideToDuplicate.description || '',
          pending_agent_action: shouldBePending,
        })
        .select()
        .single();

      if (error) throw error;

      // Replace temp ID with real ID and update pendingAgentAction
      setSlideOrder((prev) =>
        prev.map((s) => (s.id === tempId ? { ...s, id: data.id, pendingAgentAction: data.pending_agent_action } : s))
      );

      return data.id;
    } catch (err) {
      console.error('Failed to duplicate slide:', err);
      // Revert on error
      await fetchSlideOrder();
      return null;
    }
  };

  const deleteSlide = async (index: number): Promise<SlideMetadata | null> => {
    const slideToDelete = slideOrder[index];
    if (!slideToDelete) return null;

    try {
      // Capture the slide data before deletion for undo
      const deletedSlide = { ...slideToDelete };

      // Optimistic UI update - remove from local state immediately
      setSlideOrder((prev) => {
        const filtered = prev.filter((s) => s.id !== slideToDelete.id);
        // Update positions for remaining slides
        return filtered.map((s, i) => ({ ...s, position: i }));
      });

      // Soft delete - just mark with deleted_at timestamp
      const { error } = await supabase
        .from('slides')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', slideToDelete.id);

      if (error) throw error;

      // Update positions of remaining slides in DB
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
      // Revert on error
      await fetchSlideOrder();
      return null;
    }
  };

  const restoreSlide = async (slideData: SlideMetadata): Promise<boolean> => {
    try {
      const restorePosition = slideData.position;

      // Shift existing slides to make room
      const slidesToShift = slideOrder.filter((s) => s.position >= restorePosition);
      
      // Optimistic UI update
      setSlideOrder((prev) => {
        const shifted = prev.map((s) =>
          s.position >= restorePosition ? { ...s, position: s.position + 1 } : s
        );
        shifted.splice(restorePosition, 0, slideData);
        return shifted;
      });

      // Update positions in DB for shifted slides
      await Promise.all(
        slidesToShift.map((slide) =>
          supabase
            .from('slides')
            .update({ position: slide.position + 1 })
            .eq('id', slide.id)
        )
      );

      // Restore the deleted slide (clear deleted_at)
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

      // Optimistic UI update
      setSlideOrder((prev) => {
        const filtered = prev.filter((s) => s.id !== slideId);
        return filtered.map((s, i) => ({ ...s, position: i }));
      });

      // Hard delete (since it was just created via duplicate)
      const { error } = await supabase
        .from('slides')
        .delete()
        .eq('id', slideId);

      if (error) throw error;

      // Update positions
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

  const markSlidesForAgentEdit = async (slideIds: string[], description: string) => {
    try {
      // Optimistic update
      setSlideOrder((prev) =>
        prev.map((s) =>
          slideIds.includes(s.id)
            ? { ...s, pendingAgentAction: true, description }
            : s
        )
      );

      // Persist to database
      await Promise.all(
        slideIds.map((id) =>
          supabase
            .from('slides')
            .update({ pending_agent_action: true, description })
            .eq('id', id)
        )
      );
    } catch (err) {
      console.error('Failed to mark slides for agent edit:', err);
      fetchSlideOrder();
    }
  };

  const clearPendingEdit = async (slideId: string) => {
    try {
      // Optimistic update
      setSlideOrder((prev) =>
        prev.map((s) =>
          s.id === slideId
            ? { ...s, pendingAgentAction: false, description: undefined }
            : s
        )
      );

      // Persist to database
      await supabase
        .from('slides')
        .update({ pending_agent_action: false, description: null })
        .eq('id', slideId);
    } catch (err) {
      console.error('Failed to clear pending edit:', err);
      fetchSlideOrder();
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
    addWIPSlide,
    updateSlideDescription,
    duplicateSlide,
    deleteSlide,
    restoreSlide,
    removeDuplicatedSlide,
    markSlidesForAgentEdit,
    clearPendingEdit,
    refetch: fetchSlideOrder,
  };
}
