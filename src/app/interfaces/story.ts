export interface Story {
  id: number;
  title: string;
  description: string;
  content: string;
  imageUrl: string;
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
  dedicationImageUrl?: string;
  presentationImageUrl?: string;
  emotionalGuideUrl?: string;
  musicalGuideUrl?: string;
  awakeningGuideUrl?: string;
  duration?: number;
  customPhrase?: string;
  // Color theme fields for admin customization
  backgroundColor?: string; // background color of the card and pop-ups
  buttonsColor?: string; // background color for the buttons of the story
  textColorButtons?: string; // text color used on the text of the buttons
  textColor?: string; // text color used on the text of the pop-ups
  containerBackgroundColor?: string; // background color for the button containers
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
