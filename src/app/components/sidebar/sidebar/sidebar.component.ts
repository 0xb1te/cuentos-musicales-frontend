// sidebar.component.ts
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
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
export class SidebarComponent {
  sidebarOpen = signal(true);
  menuItems = signal<MenuItem[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor(private menuService: MenuService) {}

  ngOnInit() {
    this.loadMenu();
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

        // Load mock data for development
        // this.loadMockData();
      },
    });
  }

  private loadMockData() {
    const mockMenu: MenuItem[] = [
      {
        id: 1,
        title: 'Inicio',
        route: '/',
      },
      {
        id: 2,
        title: 'Cuentos',
        children: [
          {
            id: 21,
            title: 'Por Edad',
            children: [
              { id: 211, title: '3-5 años', route: '/category/3-5' },
              { id: 212, title: '6-8 años', route: '/category/6-8' },
              { id: 213, title: '9-12 años', route: '/category/9-12' },
            ],
          },
          { id: 22, title: 'Más Recientes', route: '/recent' },
          { id: 23, title: 'Más Populares', route: '/popular' },
        ],
      },
      {
        id: 3,
        title: 'Guías Didácticas',
        route: '/guides',
      },
      {
        id: 4,
        title: 'Sobre Nosotros',
        route: '/about',
      },
      {
        id: 5,
        title: 'Contacto',
        route: '/contact',
      },
    ];

    this.menuItems.set(mockMenu);
  }

  toggleSidebar() {
    this.sidebarOpen.update((value) => !value);
  }

  onMenuItemClick(item: MenuItem) {
    console.log('Item clicked:', item);
    // Handle the item click event here
  }
}
