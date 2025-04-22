// sidebar.component.ts
import { Component, signal, OnInit, HostListener } from '@angular/core';
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
    // Initialize sidebar state based on screen size
    this.checkScreenSize();
  }

  ngOnInit() {
    this.loadMenu();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  private checkScreenSize() {
    // Open by default on desktop (screens wider than 768px)
    this.sidebarOpen.set(window.innerWidth >= 768);
  }

  loadMenu() {
    this.menuService.getMenuStructure().subscribe({
      next: (items) => {
        console.log('Response from menu', items.menuStructure.items);
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
    this.sidebarOpen.update((value) => !value);
  }

  onMenuItemClick(item: MenuItem) {
    console.log('Item clicked:', item);

    // If the item has images and no route, navigate to dynamic content page
    if (item.route && item.images && item.images.length > 0) {
      console.log('Navigating to dynamic content page for menu item:', item.id);
      this.router.navigate(['/content', item.id]);
    } else {
      console.log('Navigating to route:', item.route);
      this.router.navigate([item.route || '/']);
    }

    // Close sidebar on mobile after clicking a menu item
    if (window.innerWidth < 768) {
      this.sidebarOpen.set(false);
    }
  }
}
