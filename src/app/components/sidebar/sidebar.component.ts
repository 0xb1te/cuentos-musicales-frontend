import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  sidebarOpen = signal(true);
  menuOpen = signal(false);
  childOpen = signal(false);

  toggleSidebar() {
    this.sidebarOpen.update((value) => !value);
  }

  toggleOpen() {
    this.menuOpen.update((value) => !value);
  }

  toggleChild() {
    this.childOpen.update((value) => !value);
  }
}
