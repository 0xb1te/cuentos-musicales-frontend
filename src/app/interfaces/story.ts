export interface Story {
  id: number;
  title: string;
  description: string; // Added this
  content: string;
  imageUrl: string; // Added this
  hasInteractiveElements: boolean;
  interactiveElements?: InteractiveElement[];
  teachingGuide?: TeachingGuide;
  menuLevelId?: number;
}

export interface TeachingGuide {
  id: number;
  preview: string;
  fullContent?: string;
  downloadUrl?: string;
}

export interface InteractiveElement {
  id: number;
  title: string;
  description: string;
  type: 'game' | 'quiz' | 'activity';
}
