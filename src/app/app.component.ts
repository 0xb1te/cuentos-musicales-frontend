import {
  Component,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from './components/sidebar/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent],
  template: `
    <div class="relative min-h-screen">
      <!-- Mobile Menu Button (Top Left Floating) -->
      <button
        (click)="onToggleSidebar()"
        class="fixed top-4 left-4 z-50 md:hidden bg-gray-800/90 backdrop-blur-sm text-white p-3 rounded-full shadow-xl hover:bg-gray-700/90 hover:scale-110 active:scale-95 transition-all duration-200 border border-gray-600/50"
        aria-label="Abrir menú"
      >
        <svg
          class="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          ></path>
        </svg>
      </button>

      <!-- Main Layout with Sidebar -->
      <app-sidebar #sidebar>
        <router-outlet></router-outlet>
      </app-sidebar>
    </div>
  `,
})
export class AppComponent implements AfterViewInit {
  @ViewChild('sidebar') sidebar!: SidebarComponent;

  constructor(private cdr: ChangeDetectorRef) {
    // Set up global window method as backup
    (window as any).appToggleSidebar = () => {
      this.onToggleSidebar();
    };
  }

  ngAfterViewInit() {
    console.log('App: ngAfterViewInit - sidebar available:', !!this.sidebar);

    // Initial state sync
    this.syncSidebarState();
  }

  onToggleSidebar() {
    console.log('App: onToggleSidebar - sidebar available:', !!this.sidebar);
    if (this.sidebar) {
      this.sidebar.toggleSidebar();
      // Immediate sync after toggle
      setTimeout(() => {
        this.syncSidebarState(true);
      }, 0);
    }
  }

  onCloseSidebar() {
    console.log('App: onCloseSidebar - sidebar available:', !!this.sidebar);
    if (this.sidebar) {
      this.sidebar.sidebarOpen.set(false);
      // Immediate sync after close
      setTimeout(() => {
        this.syncSidebarState(true);
      }, 0);
    }
  }

  private syncSidebarState(force = false) {
    if (this.sidebar && force) {
      this.cdr.detectChanges();
    }
  }
}
