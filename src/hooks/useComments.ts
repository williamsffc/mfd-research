import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Comment } from '@/types/slide';

export function useComments(slideId?: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchComments = useCallback(async () => {
    if (!slideId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('slide_id', slideId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Organize into threads
      const commentMap = new Map<string, Comment>();
      const rootComments: Comment[] = [];

      data.forEach((c) => {
        const comment: Comment = {
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

      setComments(rootComments);
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    } finally {
      setLoading(false);
    }
  }, [slideId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const addComment = async (
    xPosition: number,
    yPosition: number,
    authorName: string,
    content: string,
    parentId?: string
  ) => {
    if (!slideId) return null;

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          slide_id: slideId,
          parent_id: parentId,
          x_position: xPosition,
          y_position: yPosition,
          author_name: authorName,
          content,
        })
        .select()
        .single();

      if (error) throw error;
      
      await fetchComments();
      return data;
    } catch (err) {
      console.error('Failed to add comment:', err);
      return null;
    }
  };

  const resolveComment = async (commentId: string, resolved: boolean) => {
    try {
      const { error } = await supabase
        .from('comments')
        .update({ resolved })
        .eq('id', commentId);

      if (error) throw error;
      await fetchComments();
    } catch (err) {
      console.error('Failed to resolve comment:', err);
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;
      await fetchComments();
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  return {
    comments,
    loading,
    refetch: fetchComments,
    addComment,
    resolveComment,
    deleteComment,
  };
}
