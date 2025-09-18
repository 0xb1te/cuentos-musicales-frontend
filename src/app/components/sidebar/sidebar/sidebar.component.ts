// sidebar.component.ts
import { Component, signal, OnInit, HostListener, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MenuItemComponent } from '../menu-item/menu-item.component';
import { MenuService } from '../../../services/menu.service';
import { MenuItem } from '../../../interfaces/menu';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, MenuItemComponent],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  sidebarOpen = signal(false);
  menuItems = signal<MenuItem[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor(private menuService: MenuService, private router: Router) {
    this.checkScreenSize();

    // Effect to track sidebar state changes
    effect(() => {
      console.log('Sidebar: sidebarOpen state changed to:', this.sidebarOpen());
    });
  }

  ngOnInit() {
    this.loadMenu();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    const isMobile = window.innerWidth < 768;
    const shouldBeOpen = !isMobile; // false for mobile, true for desktop
    console.log(
      'Sidebar: checkScreenSize - isMobile:',
      isMobile,
      'shouldBeOpen:',
      shouldBeOpen
    );
    this.sidebarOpen.set(shouldBeOpen);
  }

  loadMenu() {
    this.menuService.getMenuStructure().subscribe({
      next: (items) => {
        this.menuItems.set(items.menuStructure.items);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading menu:', err);
        this.error.set('Error cargando el menú');
        this.loading.set(false);
      },
    });
  }

  toggleSidebar() {
    const currentState = this.sidebarOpen();
    console.log(
      'Sidebar: toggleSidebar - current state:',
      currentState,
      'new state:',
      !currentState
    );
    this.sidebarOpen.update((value) => !value);
  }

  onMenuItemClick(item: MenuItem) {
    console.log('Sidebar: menu item clicked:', item.title);
    // Navigate based on item configuration
    if (item.route && item.images && item.images.length > 0) {
      this.router.navigate(['/content', item.id]);
    } else {
      this.router.navigate([item.route || '/']);
    }

    // Close sidebar on mobile after clicking a menu item
    if (window.innerWidth < 768) {
      console.log('Sidebar: closing sidebar on mobile');
      this.sidebarOpen.set(false);
    }
  }
}
