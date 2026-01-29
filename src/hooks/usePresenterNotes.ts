import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface PresenterNote {
  id: string;
  slideId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export function usePresenterNotes(slideId: string | null) {
  const [note, setNote] = useState<PresenterNote | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchNote = useCallback(async () => {
    if (!slideId) {
      setNote(null);
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
        setNote({
          id: data.id,
          slideId: data.slide_id,
          content: data.content,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
        });
      } else {
        setNote(null);
      }
    } catch (err) {
      console.error('Failed to fetch presenter note:', err);
    } finally {
      setLoading(false);
    }
  }, [slideId]);

  useEffect(() => {
    fetchNote();
  }, [fetchNote]);

  const saveNote = async (content: string): Promise<boolean> => {
    if (!slideId) return false;

    try {
      if (note) {
        // Update existing note
        const { error } = await supabase
          .from('presenter_notes')
          .update({ content })
          .eq('id', note.id);

        if (error) throw error;
      } else {
        // Create new note
        const { error } = await supabase
          .from('presenter_notes')
          .insert({
            slide_id: slideId,
            content,
          });

        if (error) throw error;
      }

      await fetchNote();
      return true;
    } catch (err) {
      console.error('Failed to save presenter note:', err);
      return false;
    }
  };

  const deleteNote = async (): Promise<boolean> => {
    if (!note) return false;

    try {
      const { error } = await supabase
        .from('presenter_notes')
        .delete()
        .eq('id', note.id);

      if (error) throw error;

      setNote(null);
      return true;
    } catch (err) {
      console.error('Failed to delete presenter note:', err);
      return false;
    }
  };

  return {
    note,
    loading,
    saveNote,
    deleteNote,
    refetch: fetchNote,
  };
}
