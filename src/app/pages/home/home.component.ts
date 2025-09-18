import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoryGridComponent } from '../../components/story-grid/story-grid.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, StoryGridComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  scrollToSection(sectionId: string) {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
