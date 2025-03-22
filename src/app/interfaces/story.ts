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
  author?: string;
  isFree?: boolean;
  audioPreviewUrl?: string;
  audioFullUrl?: string;
  indicativeImage1?: string;
  indicativeImage2?: string;
  emotionalGuideUrl?: string;
  musicalGuideUrl?: string;
  educationalGuideUrl?: string;
  duration?: number; // in minutes
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
