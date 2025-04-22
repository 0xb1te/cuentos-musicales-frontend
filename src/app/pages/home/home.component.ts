import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoryGridComponent } from '../../components/story-grid/story-grid.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, StoryGridComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  scrolled = false;

  constructor() {}

  ngOnInit(): void {
    // Check initial scroll position
    this.checkScroll();
  }

  @HostListener('window:scroll', [])
  checkScroll(): void {
    // Update scrolled property based on scroll position
    this.scrolled = window.scrollY > 50;
  }

  scrollToStories(): void {
    // Smooth scroll to the stories section
    const element = document.getElementById('stories-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
