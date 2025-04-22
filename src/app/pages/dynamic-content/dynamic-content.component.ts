import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuService } from '../../services/menu.service';
import { MenuItem } from '../../interfaces/menu';

@Component({
  selector: 'app-dynamic-content',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dynamic-content.component.html',
  styleUrl: './dynamic-content.component.scss',
})
export class DynamicContentComponent implements OnInit {
  menuItem: MenuItem | null = null;
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private menuService: MenuService
  ) {}

  ngOnInit(): void {
    // Get the route parameter id
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.loadMenuItem(Number(id));
      } else {
        this.error = true;
        this.loading = false;
      }
    });
  }

  loadMenuItem(id: number): void {
    this.menuService.getMenuStructure().subscribe({
      next: (response) => {
        // Find the menu item by id in the menu structure
        const item = this.findMenuItemById(response.menuStructure.items, id);
        if (item) {
          this.menuItem = item;
        } else {
          this.error = true;
        }
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      },
    });
  }

  findMenuItemById(items: MenuItem[], id: number): MenuItem | null {
    for (const item of items) {
      if (item.id === id) {
        return item;
      }

      // Recursively check children
      if (item.children) {
        const found = this.findMenuItemById(item.children, id);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }
}
