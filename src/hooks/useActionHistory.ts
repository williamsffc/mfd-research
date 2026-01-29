import { useState, useCallback, useRef } from 'react';

export type ActionType = 'delete' | 'reorder' | 'duplicate' | 'bulk-move';

export interface Action {
  type: ActionType;
  // Data to reverse the action
  undoData: any;
  // Data to redo the action
  redoData: any;
  // Human-readable description
  description: string;
}

interface UseActionHistoryReturn {
  canUndo: boolean;
  canRedo: boolean;
  isProcessing: boolean;
  undoDescription: string | null;
  redoDescription: string | null;
  pushAction: (action: Action) => void;
  undo: () => Action | null;
  redo: () => Action | null;
  setProcessing: (processing: boolean) => void;
  clear: () => void;
}

const MAX_HISTORY = 20;

export function useActionHistory(): UseActionHistoryReturn {
  const [undoStack, setUndoStack] = useState<Action[]>([]);
  const [redoStack, setRedoStack] = useState<Action[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Use refs to avoid stale closures in undo/redo
  const undoStackRef = useRef<Action[]>([]);
  const redoStackRef = useRef<Action[]>([]);
  
  // Keep refs in sync
  undoStackRef.current = undoStack;
  redoStackRef.current = redoStack;

  const pushAction = useCallback((action: Action) => {
    // Don't push actions while processing undo/redo
    if (isProcessing) return;
    
    setUndoStack(prev => {
      const newStack = [...prev, action];
      // Keep only the last MAX_HISTORY actions
      if (newStack.length > MAX_HISTORY) {
        return newStack.slice(-MAX_HISTORY);
      }
      return newStack;
    });
    // Clear redo stack when a new action is performed
    setRedoStack([]);
  }, [isProcessing]);

  const undo = useCallback((): Action | null => {
    const stack = undoStackRef.current;
    if (stack.length === 0 || isProcessing) return null;
    
    const action = stack[stack.length - 1];
    setUndoStack(prev => prev.slice(0, -1));
    setRedoStack(prev => [...prev, action]);
    return action;
  }, [isProcessing]);

  const redo = useCallback((): Action | null => {
    const stack = redoStackRef.current;
    if (stack.length === 0 || isProcessing) return null;
    
    const action = stack[stack.length - 1];
    setRedoStack(prev => prev.slice(0, -1));
    setUndoStack(prev => [...prev, action]);
    return action;
  }, [isProcessing]);

  const setProcessing = useCallback((processing: boolean) => {
    setIsProcessing(processing);
  }, []);

  const clear = useCallback(() => {
    setUndoStack([]);
    setRedoStack([]);
  }, []);

  return {
    canUndo: undoStack.length > 0 && !isProcessing,
    canRedo: redoStack.length > 0 && !isProcessing,
    isProcessing,
    undoDescription: undoStack.length > 0 ? undoStack[undoStack.length - 1].description : null,
    redoDescription: redoStack.length > 0 ? redoStack[redoStack.length - 1].description : null,
    pushAction,
    undo,
    redo,
    setProcessing,
    clear,
  };
}
