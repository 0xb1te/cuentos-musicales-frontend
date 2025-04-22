import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
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
  isEditing = false;
  currentOptionId: number | null = null;
  hasChildItems = false;

  constructor(
    private fb: FormBuilder,
    private menuService: MenuService,
    private router: Router
  ) {
    this.menuOptionForm = this.fb.group(
      {
        parentId: [0, Validators.required],
        title: ['', Validators.required],
        route: [''],
      },
      { validators: this.customValidators() }
    );
  }

  ngOnInit(): void {
    this.loadMenuItems();
    this.loadMenuOptionsFlat();
  }

  // Custom validators for form
  customValidators(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const images = this.uploadedImages;
      const route = group.get('route')?.value;

      // If menu item has images
      if (images && images.length > 0) {
        // Route is required when images are present
        if (!route) {
          group.get('route')?.setErrors({ routeRequiredWithImages: true });
          return { routeRequiredWithImages: true };
        }

        // Check if this is an edit and the item has children
        if (this.isEditing && this.currentOptionId && this.hasChildItems) {
          return { cannotHaveImagesAndChildren: true };
        }
      }

      return null;
    };
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

  // Check if the selected menu option has children
  checkForChildren(optionId: number): boolean {
    if (!optionId) return false;
    // Find any menu option that has this option as parent
    return this.menuOptionsFlat.some((option) => option.parentId === optionId);
  }

  // Seleccionar opción para editar
  selectOptionForEdit(option: any): void {
    this.isEditing = true;
    this.currentOptionId = option.id;
    this.hasChildItems = this.checkForChildren(option.id);

    // Rellenar el formulario con los datos de la opción seleccionada
    this.menuOptionForm.patchValue({
      parentId: option.parentId || 0,
      title: option.title,
      route: option.route || '',
    });

    // Set the uploaded images
    if (option.images && option.images.length > 0) {
      this.uploadedImages = [...option.images];
    } else {
      this.uploadedImages = [];
    }

    // Validate form after setting values
    this.menuOptionForm.updateValueAndValidity();
  }

  // Cancelar edición
  cancelEdit(): void {
    this.isEditing = false;
    this.currentOptionId = null;
    this.hasChildItems = false;
    this.resetForm();
  }

  // Eliminar opción de menú
  deleteOption(id: number): void {
    // Check if option has children
    if (this.checkForChildren(id)) {
      alert(
        'No se puede eliminar esta opción porque tiene elementos hijos. Elimine primero los elementos hijos.'
      );
      return;
    }

    if (
      confirm(
        '¿Está seguro de eliminar esta opción de menú? Esta acción no se puede deshacer.'
      )
    ) {
      this.isLoading = true;
      this.menuService.deleteMenuOption(id).subscribe({
        next: () => {
          this.isLoading = false;
          this.loadMenuItems();
          this.loadMenuOptionsFlat();
          alert('Opción de menú eliminada correctamente');
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error eliminando opción de menú:', error);
          alert('Error al eliminar la opción de menú');
        },
      });
    }
  }

  resetForm(): void {
    this.menuOptionForm.reset({
      parentId: 0,
      title: '',
      route: '',
    });
    this.uploadedImages = [];
    this.hasChildItems = false;
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
        // Extract the URL from the response object
        const imageUrl = response.url;
        // Add the image URL to our list of uploaded images
        this.uploadedImages.push(imageUrl);
        // Clear the file input
        this.selectedFile = null;
        // Validate form after adding image
        this.menuOptionForm.updateValueAndValidity();
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error uploading image:', error);
      },
    });
  }

  removeImage(index: number): void {
    this.uploadedImages.splice(index, 1);
    // Validate form after removing image
    this.menuOptionForm.updateValueAndValidity();
  }

  onSubmit(): void {
    if (this.menuOptionForm.valid) {
      // Check if item has images and has child items
      if (
        this.uploadedImages.length > 0 &&
        this.isEditing &&
        this.currentOptionId
      ) {
        const hasChildren = this.checkForChildren(this.currentOptionId);
        if (hasChildren) {
          alert(
            'No se puede guardar una opción con imágenes si tiene elementos hijos. Elimine las imágenes o los elementos hijos.'
          );
          return;
        }
      }

      const menuOption: MenuOptionRequest = {
        ...this.menuOptionForm.value,
        images:
          this.uploadedImages.length > 0 ? [...this.uploadedImages] : undefined,
      };

      this.isLoading = true;

      if (this.isEditing && this.currentOptionId) {
        // Actualizar opción existente
        this.menuService
          .updateMenuOption(this.currentOptionId, menuOption)
          .subscribe({
            next: () => {
              this.isLoading = false;
              this.isEditing = false;
              this.currentOptionId = null;
              this.resetForm();
              this.loadMenuItems();
              this.loadMenuOptionsFlat();
              alert('Opción de menú actualizada correctamente');
            },
            error: (error) => {
              this.isLoading = false;
              console.error('Error actualizando opción de menú:', error);
              alert('Error al actualizar la opción de menú');
            },
          });
      } else {
        // Crear nueva opción
        this.menuService.addMenuOption(menuOption).subscribe({
          next: () => {
            this.isLoading = false;
            this.resetForm();
            this.loadMenuItems();
            this.loadMenuOptionsFlat();
            alert('Opción de menú creada correctamente');
          },
          error: (error) => {
            this.isLoading = false;
            console.error('Error creating menu option:', error);
            alert('Error al crear la opción de menú');
          },
        });
      }
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.menuOptionForm.controls).forEach((key) => {
        const control = this.menuOptionForm.get(key);
        control?.markAsTouched();
      });

      // Show appropriate error message
      if (this.menuOptionForm.hasError('routeRequiredWithImages')) {
        alert('Cuando se añaden imágenes, la ruta es obligatoria.');
      } else if (this.menuOptionForm.hasError('cannotHaveImagesAndChildren')) {
        alert(
          'Una opción de menú no puede tener imágenes y elementos hijos al mismo tiempo.'
        );
      }
    }
  }
}
