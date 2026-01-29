import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Comment } from '@/types/slide';

const DEMO_PRESENTATION_ID = '00000000-0000-0000-0000-000000000001';

export interface CommentWithSlide extends Comment {
  slidePosition: number;
}

export function useAllComments() {
  const [comments, setComments] = useState<CommentWithSlide[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAllComments = useCallback(async () => {
    try {
      setLoading(true);
      
      // First get all slides for this presentation
      const { data: slides, error: slidesError } = await supabase
        .from('slides')
        .select('id, position')
        .eq('presentation_id', DEMO_PRESENTATION_ID)
        .is('deleted_at', null)
        .order('position', { ascending: true });

      if (slidesError) throw slidesError;
      if (!slides || slides.length === 0) {
        setComments([]);
        return;
      }

      const slideIds = slides.map(s => s.id);
      const slidePositionMap = new Map(slides.map(s => [s.id, s.position]));

      // Fetch all comments for these slides
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .in('slide_id', slideIds)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Organize into threads with slide position
      const commentMap = new Map<string, CommentWithSlide>();
      const rootComments: CommentWithSlide[] = [];

      data.forEach((c) => {
        const comment: CommentWithSlide = {
          id: c.id,
          slideId: c.slide_id,
          parentId: c.parent_id ?? undefined,
          xPosition: Number(c.x_position),
          yPosition: Number(c.y_position),
          authorName: c.author_name,
          content: c.content,
          resolved: c.resolved,
          createdAt: c.created_at,
          replies: [],
          slidePosition: slidePositionMap.get(c.slide_id) ?? 0,
        };
        commentMap.set(c.id, comment);
      });

      commentMap.forEach((comment) => {
        if (comment.parentId) {
          const parent = commentMap.get(comment.parentId);
          if (parent) {
            parent.replies = parent.replies || [];
            parent.replies.push(comment);
          }
        } else {
          rootComments.push(comment);
        }
      });

      // Sort by slide position, then by creation time
      rootComments.sort((a, b) => {
        if (a.slidePosition !== b.slidePosition) {
          return a.slidePosition - b.slidePosition;
        }
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      });

      setComments(rootComments);
    } catch (err) {
      console.error('Failed to fetch all comments:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllComments();
  }, [fetchAllComments]);

  return {
    comments,
    loading,
    refetch: fetchAllComments,
  };
}
