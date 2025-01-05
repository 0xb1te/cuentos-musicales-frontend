import { InteractiveElement } from './interactive-element';
import { TeachingGuide } from './teaching-guide';

export interface Story {
  id: number;
  title: string;
  description: string; // Added this
  content: string;
  imageUrl: string; // Added this
  hasInteractiveElements: boolean;
  interactiveElements?: InteractiveElement[];
  teachingGuide?: TeachingGuide;
}
