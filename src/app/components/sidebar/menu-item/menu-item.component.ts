import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MenuItem } from '../../../interfaces/menu';

@Component({
  selector: 'app-menu-item',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './menu-item.component.html',
})
export class MenuItemComponent {
  @Input({ required: true }) item!: MenuItem;
  isOpen = signal(false);

  toggleOpen() {
    this.isOpen.update((value) => !value);
  }
}
