import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface SlideChange {
  id: string;
  slideId: string;
  content: string;
  resolved: boolean;
  createdAt: string;
  xPosition: number;
  yPosition: number;
}

export function useSlideChanges(slideId: string | null) {
  const [changes, setChanges] = useState<SlideChange[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchChanges = useCallback(async () => {
    if (!slideId) {
      setChanges([]);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('slide_changes')
        .select('*')
        .eq('slide_id', slideId)
        .eq('resolved', false)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setChanges(
        (data || []).map((c) => ({
          id: c.id,
          slideId: c.slide_id,
          content: c.content,
          resolved: c.resolved,
          createdAt: c.created_at,
          xPosition: Number(c.x_position) || 50,
          yPosition: Number(c.y_position) || 50,
        }))
      );
    } catch (err) {
      console.error('Failed to fetch slide changes:', err);
    } finally {
      setLoading(false);
    }
  }, [slideId]);

  useEffect(() => {
    fetchChanges();
  }, [fetchChanges]);

  // Realtime subscription
  useEffect(() => {
    if (!slideId) return;

    const channel = supabase
      .channel(`slide_changes_${slideId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'slide_changes',
          filter: `slide_id=eq.${slideId}`,
        },
        () => {
          fetchChanges();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [slideId, fetchChanges]);

  const addChange = async (content: string, xPosition: number = 50, yPosition: number = 50): Promise<string | null> => {
    if (!slideId || !content.trim()) return null;

    try {
      const { data, error } = await supabase
        .from('slide_changes')
        .insert({
          slide_id: slideId,
          content: content.trim(),
          x_position: xPosition,
          y_position: yPosition,
        })
        .select()
        .single();

      if (error) throw error;

      // Update pending_agent_action on the slide
      await supabase
        .from('slides')
        .update({ pending_agent_action: true })
        .eq('id', slideId);

      return data.id;
    } catch (err) {
      console.error('Failed to add slide change:', err);
      return null;
    }
  };

  const updateChange = async (changeId: string, content: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('slide_changes')
        .update({ content: content.trim() })
        .eq('id', changeId);

      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Failed to update slide change:', err);
      return false;
    }
  };

  const deleteChange = async (changeId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('slide_changes')
        .delete()
        .eq('id', changeId);

      if (error) throw error;

      // Check if there are any remaining changes
      const { count } = await supabase
        .from('slide_changes')
        .select('*', { count: 'exact', head: true })
        .eq('slide_id', slideId)
        .eq('resolved', false);

      // If no more changes, clear pending_agent_action
      if (count === 0 && slideId) {
        await supabase
          .from('slides')
          .update({ pending_agent_action: false })
          .eq('id', slideId);
      }

      return true;
    } catch (err) {
      console.error('Failed to delete slide change:', err);
      return false;
    }
  };

  const resolveChange = async (changeId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('slide_changes')
        .update({ resolved: true })
        .eq('id', changeId);

      if (error) throw error;

      // Check if there are any remaining unresolved changes
      const { count } = await supabase
        .from('slide_changes')
        .select('*', { count: 'exact', head: true })
        .eq('slide_id', slideId)
        .eq('resolved', false);

      // If no more unresolved changes, clear pending_agent_action
      if (count === 0 && slideId) {
        await supabase
          .from('slides')
          .update({ pending_agent_action: false })
          .eq('id', slideId);
      }

      return true;
    } catch (err) {
      console.error('Failed to resolve slide change:', err);
      return false;
    }
  };

  return {
    changes,
    loading,
    addChange,
    updateChange,
    deleteChange,
    resolveChange,
    refetch: fetchChanges,
  };
}

// Hook to get change counts for multiple slides (for thumbnails)
export function useAllSlideChanges() {
  const [changeCounts, setChangeCounts] = useState<Record<string, number>>({});

  const fetchAllCounts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('slide_changes')
        .select('slide_id')
        .eq('resolved', false);

      if (error) throw error;

      const counts: Record<string, number> = {};
      (data || []).forEach((c) => {
        counts[c.slide_id] = (counts[c.slide_id] || 0) + 1;
      });
      setChangeCounts(counts);
    } catch (err) {
      console.error('Failed to fetch slide change counts:', err);
    }
  }, []);

  useEffect(() => {
    fetchAllCounts();
  }, [fetchAllCounts]);

  // Realtime subscription for all changes
  useEffect(() => {
    const channel = supabase
      .channel('all_slide_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'slide_changes',
        },
        () => {
          fetchAllCounts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchAllCounts]);

  return { changeCounts, refetch: fetchAllCounts };
}
