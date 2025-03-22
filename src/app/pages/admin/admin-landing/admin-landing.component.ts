import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div
      class="admin-landing-container flex items-center justify-center min-h-[70vh]"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          class="admin-card bg-white p-8 rounded-lg shadow-md flex flex-col items-center"
        >
          <h3 class="text-xl font-semibold mb-4">Gestión de Cuentos</h3>
          <p class="text-gray-600 mb-6 text-center">
            Crear, editar y administrar los cuentos de la plataforma
          </p>
          <a
            routerLink="/admin/create"
            class="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 text-center w-full"
          >
            Crear un cuento
          </a>
        </div>

        <div
          class="admin-card bg-white p-8 rounded-lg shadow-md flex flex-col items-center"
        >
          <h3 class="text-xl font-semibold mb-4">Gestión de Menú</h3>
          <p class="text-gray-600 mb-6 text-center">
            Añadir opciones de menú para la navegación
          </p>
          <a
            routerLink="/admin/menu"
            class="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 text-center w-full"
          >
            Insertar una opción de menú
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .admin-card {
        transition: transform 0.3s ease;
      }
      .admin-card:hover {
        transform: translateY(-5px);
      }
    `,
  ],
})
export class AdminLandingComponent {}
