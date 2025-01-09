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
      },
    });
  }

  toggleSidebar() {
    this.sidebarOpen.update((value) => !value);
  }

  onMenuItemClick(item: MenuItem) {
    console.log('Item clicked:', item);
    // Handle the item click event here
  }
}
