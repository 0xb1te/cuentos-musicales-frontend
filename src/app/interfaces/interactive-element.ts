export interface InteractiveElement {
  id: number;
  title: string;
  description: string;
  type: 'game' | 'quiz' | 'activity';
}
