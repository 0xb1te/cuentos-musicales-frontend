import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuService } from '../../../services/menu.service';
import { MenuItem, MenuOptionRequest } from '../../../interfaces/menu';

@Component({
  selector: 'app-menu-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './menu-management.component.html',
  styleUrls: ['./menu-management.component.scss'],
})
export class MenuManagementComponent implements OnInit {
  menuOptionForm: FormGroup;
  menuItems: MenuItem[] = [];
  menuOptionsFlat: any[] = [];
  selectedFile: File | null = null;
  uploadedImages: string[] = [];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private menuService: MenuService,
    private router: Router
  ) {
    this.menuOptionForm = this.fb.group({
      parentId: [0, Validators.required],
      title: ['', Validators.required],
      route: [''],
      imageUrl: [''],
    });
  }

  ngOnInit(): void {
    this.loadMenuItems();
    this.loadMenuOptionsFlat();
  }

  loadMenuItems(): void {
    this.menuService.getMenuStructure().subscribe((response) => {
      this.menuItems = response.menuStructure.items;
    });
  }

  loadMenuOptionsFlat(): void {
    this.menuService.getMenuOptionsFlat().subscribe({
      next: (options) => {
        this.menuOptionsFlat = options;
        console.log('Opciones de menú cargadas en formato plano:', options);
      },
      error: (error) => {
        console.error(
          'Error al cargar opciones de menú en formato plano:',
          error
        );
      },
    });
  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
      this.uploadImage();
    }
  }

  uploadImage(): void {
    if (!this.selectedFile) return;

    this.isLoading = true;
    this.menuService.uploadMenuImage(this.selectedFile).subscribe({
      next: (response) => {
        this.isLoading = false;
        // Add the image URL to our list of uploaded images
        this.uploadedImages.push(response);
        // Clear the file input
        this.selectedFile = null;
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error uploading image:', error);
      },
    });
  }

  removeImage(index: number): void {
    this.uploadedImages.splice(index, 1);
  }

  onSubmit(): void {
    if (this.menuOptionForm.valid) {
      const menuOption: MenuOptionRequest = {
        ...this.menuOptionForm.value,
        imageUrl:
          this.uploadedImages.length > 0 ? this.uploadedImages[0] : undefined,
      };

      this.isLoading = true;
      this.menuService.addMenuOption(menuOption).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/admin']);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error creating menu option:', error);
        },
      });
    }
  }
}
