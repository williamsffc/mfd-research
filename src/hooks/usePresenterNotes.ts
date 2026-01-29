import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { PresenterNotes } from '@/types/slide';

export function usePresenterNotes(slideId: string | undefined) {
  const [notes, setNotes] = useState<PresenterNotes | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchNotes = useCallback(async () => {
    if (!slideId) {
      setNotes(null);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('presenter_notes')
        .select('*')
        .eq('slide_id', slideId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setNotes({
          id: data.id,
          slideId: data.slide_id,
          content: data.content,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        });
      } else {
        setNotes(null);
      }
    } catch (err) {
      console.error('Failed to fetch presenter notes:', err);
    } finally {
      setLoading(false);
    }
  }, [slideId]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const saveNotes = useCallback(async (content: string) => {
    if (!slideId) return false;

    try {
      if (notes) {
        // Update existing
        const { error } = await supabase
          .from('presenter_notes')
          .update({ content })
          .eq('id', notes.id);

        if (error) throw error;

        setNotes((prev) => prev ? { ...prev, content, updatedAt: new Date().toISOString() } : null);
      } else {
        // Create new
        const { data, error } = await supabase
          .from('presenter_notes')
          .insert({ slide_id: slideId, content })
          .select()
          .single();

        if (error) throw error;

        setNotes({
          id: data.id,
          slideId: data.slide_id,
          content: data.content,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        });
      }
      return true;
    } catch (err) {
      console.error('Failed to save presenter notes:', err);
      return false;
    }
  }, [slideId, notes]);

  const deleteNotes = useCallback(async () => {
    if (!notes) return false;

    try {
      const { error } = await supabase
        .from('presenter_notes')
        .delete()
        .eq('id', notes.id);

      if (error) throw error;

      setNotes(null);
      return true;
    } catch (err) {
      console.error('Failed to delete presenter notes:', err);
      return false;
    }
  }, [notes]);

  return {
    notes,
    loading,
    saveNotes,
    deleteNotes,
    refetch: fetchNotes,
  };
}
