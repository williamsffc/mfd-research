export interface SlideComponent {
  id: string;
  render: () => React.ReactNode;
}

export interface SlideMetadata {
  id: string;
  presentationId: string;
  filePath: string;
  position: number;
  description?: string;
  templateType?: string;
  pendingAgentAction?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Presentation {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  slideId: string;
  parentId?: string;
  xPosition: number;
  yPosition: number;
  authorName: string;
  content: string;
  resolved: boolean;
  createdAt: string;
  replies?: Comment[];
}

export interface CMSString {
  id: string;
  key: string;
  value: string;
  category?: string;
}

export type TemplateType = 
  | 'title'
  | 'section-header'
  | 'two-column'
  | 'three-up'
  | 'chart-focus'
  | 'data-story'
  | 'comparison'
  | 'timeline'
  | 'quote'
  | 'blank';

export interface GridPosition {
  col: number; // 1-6
  row: number; // 1-6
  colSpan?: number;
  rowSpan?: number;
}
