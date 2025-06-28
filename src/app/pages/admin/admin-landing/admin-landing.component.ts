import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div
      class="admin-landing-container flex items-center justify-center min-h-[70vh] p-4"
    >
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">
        <div
          class="admin-card bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-600 flex flex-col items-center text-center"
        >
          <div class="text-4xl mb-4">📚</div>
          <h3 class="text-2xl font-semibold mb-4 text-white">
            Gestión de Cuentos
          </h3>
          <p class="text-gray-300 mb-6">
            Crear, editar y administrar los cuentos de la plataforma
          </p>
          <div class="space-y-3 w-full">
            <a
              routerLink="/admin/create"
              class="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-center w-full block"
            >
              Crear un cuento
            </a>
            <a
              routerLink="/admin/summary"
              class="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium transition-colors text-center w-full block"
            >
              Ver todos los cuentos
            </a>
          </div>
        </div>

        <div
          class="admin-card bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-600 flex flex-col items-center text-center"
        >
          <div class="text-4xl mb-4">🗂️</div>
          <h3 class="text-2xl font-semibold mb-4 text-white">
            Gestión de Menú
          </h3>
          <p class="text-gray-300 mb-6">
            Añadir opciones de menú para la navegación de la plataforma
          </p>
          <a
            routerLink="/admin/menu"
            class="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-center w-full block"
          >
            Gestionar opciones de menú
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .admin-card {
        transition: all 0.3s ease;
      }
      .admin-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4),
          0 10px 10px -5px rgba(0, 0, 0, 0.2);
      }
    `,
  ],
})
export class AdminLandingComponent {}
