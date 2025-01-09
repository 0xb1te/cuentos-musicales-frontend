// category.service.ts
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  selectedMenuLevelId = signal<number | null>(null); // Rename to selectedMenuLevelId

  setSelectedMenuLevelId(menuLevelId: number) {
    this.selectedMenuLevelId.set(menuLevelId);
  }

  getSelectedMenuLevelId() {
    return this.selectedMenuLevelId();
  }
}
