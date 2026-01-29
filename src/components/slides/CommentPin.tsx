import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { MessageCircle, Check, X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useSlideScale } from '@/components/slides/SlideCanvas';
import type { Comment } from '@/types/slide';

interface CommentPinProps {
  comment: Comment;
  onResolve?: (resolved: boolean) => void;
  onReply?: (authorName: string, content: string) => void;
  onDelete?: () => void;
}

export function CommentPin({
  comment,
  onResolve,
  onReply,
  onDelete,
}: CommentPinProps) {
  const scale = useSlideScale();
  const [replyAuthor, setReplyAuthor] = useState('');
  const [replyContent, setReplyContent] = useState('');
  const [showReply, setShowReply] = useState(false);

  const handleSubmitReply = () => {
    if (replyAuthor.trim() && replyContent.trim()) {
      onReply?.(replyAuthor.trim(), replyContent.trim());
      setReplyAuthor('');
      setReplyContent('');
      setShowReply(false);
    }
  };

  // Inverse scale to maintain consistent size
  const inverseScale = 1 / scale;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn('comment-pin', comment.resolved && 'resolved')}
          style={{
            position: 'absolute',
            left: `${comment.xPosition}%`,
            top: `${comment.yPosition}%`,
            transform: `translate(-50%, -50%) scale(${inverseScale})`,
          }}
        >
          <MessageCircle className="w-4 h-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-64 p-0" 
        align="start"
      >
        <div className="p-3 border-b">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-medium text-sm">{comment.authorName}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(comment.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => onResolve?.(!comment.resolved)}
              >
                <Check className={cn('h-4 w-4', comment.resolved && 'text-green-500')} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 hover:text-destructive"
                onClick={onDelete}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="mt-2 text-sm">{comment.content}</p>
        </div>

        {/* Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="border-b">
            {comment.replies.map((reply) => (
              <div key={reply.id} className="p-3 bg-muted/50">
                <p className="font-medium text-xs">{reply.authorName}</p>
                <p className="text-sm mt-1">{reply.content}</p>
              </div>
            ))}
          </div>
        )}

        {/* Reply form */}
        <div className="p-3">
          {showReply ? (
            <div className="space-y-2">
              <Input
                placeholder="Your name"
                value={replyAuthor}
                onChange={(e) => setReplyAuthor(e.target.value)}
                className="h-9 text-sm"
              />
              <Textarea
                placeholder="Write a reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="min-h-[80px] text-sm"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="h-8"
                  onClick={handleSubmitReply}
                  disabled={!replyAuthor.trim() || !replyContent.trim()}
                >
                  <Send className="h-4 w-4 mr-1" />
                  Reply
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8"
                  onClick={() => setShowReply(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="w-full h-8"
              onClick={() => setShowReply(true)}
            >
              Add reply
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
