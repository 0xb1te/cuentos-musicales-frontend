import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ViewContainerRef,
  ComponentRef,
  ComponentFactoryResolver,
  Injector,
  Inject,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-material-popup',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="popup-container" [style.background]="getPopupBackground()">
      <div
        class="header-container"
        *ngIf="!data.hideHeader"
        [style.background]="getHeaderBackground()"
      >
        <h2 mat-dialog-title [style.color]="data.textColor || '#f9fafb'">
          {{ data.title }}
        </h2>
        <button mat-icon-button (click)="onClose()" class="close-button">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      <button
        *ngIf="data.hideHeader"
        mat-icon-button
        (click)="onClose()"
        class="close-button-floating"
      >
        <mat-icon>close</mat-icon>
      </button>
      <mat-dialog-content
        [class.no-header]="data.hideHeader"
        [style.background]="getContentBackground()"
        [style.color]="data.textColor || '#f9fafb'"
      >
        <ng-container #content></ng-container>
      </mat-dialog-content>
    </div>
  `,
  styles: [
    `
      .popup-container {
        background: linear-gradient(145deg, #1f2937, #111827);
        border-radius: 12px;
        padding: 0;
        min-width: 300px;
        position: relative;
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      }

      .header-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 20px 24px 16px;
        border-bottom: 1px solid #374151;
        background: rgba(31, 41, 55, 0.8);
        border-radius: 12px 12px 0 0;
      }

      h2 {
        margin: 0;
        color: #f9fafb;
        font-size: 1.5rem;
        font-weight: 600;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
      }

      .close-button {
        color: #f87171;
        background: rgba(239, 68, 68, 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        transition: all 0.3s ease;
        padding: 0;
        margin: 0;
        min-width: 40px;
        line-height: 40px;
        border: 1px solid rgba(239, 68, 68, 0.2);
      }

      .close-button:hover {
        background: rgba(239, 68, 68, 0.2);
        color: #fca5a5;
        transform: scale(1.05);
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
      }

      .close-button-floating {
        position: absolute;
        top: 16px;
        right: 16px;
        z-index: 1000;
        color: #ffffff;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        transition: all 0.3s ease;
        padding: 0;
        margin: 0;
        min-width: 44px;
        line-height: 44px;
        border: 2px solid rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(10px);
      }

      .close-button-floating:hover {
        background: rgba(0, 0, 0, 0.9);
        color: #f87171;
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
        border-color: rgba(248, 113, 113, 0.5);
      }

      .close-button mat-icon,
      .close-button-floating mat-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
        line-height: 24px;
        margin: 0;
        padding: 0;
      }

      mat-dialog-content {
        padding: 24px;
        background: linear-gradient(145deg, #1f2937, #111827);
        border-radius: 0 0 12px 12px;
        color: #f9fafb;
        max-height: 70vh;
        overflow-y: auto;
      }

      mat-dialog-content.no-header {
        border-radius: 12px;
        padding: 16px;
      }

      /* Custom scrollbar */
      mat-dialog-content::-webkit-scrollbar {
        width: 8px;
      }

      mat-dialog-content::-webkit-scrollbar-track {
        background: rgba(55, 65, 81, 0.3);
        border-radius: 4px;
      }

      mat-dialog-content::-webkit-scrollbar-thumb {
        background: rgba(156, 163, 175, 0.5);
        border-radius: 4px;
      }

      mat-dialog-content::-webkit-scrollbar-thumb:hover {
        background: rgba(156, 163, 175, 0.7);
      }

      :host ::ng-deep .mat-mdc-icon-button {
        padding: 0;
        min-width: 40px;
        width: 40px;
        height: 40px;
        line-height: 40px;
      }

      :host ::ng-deep .mat-mdc-dialog-container {
        background: transparent;
        box-shadow: none;
      }

      :host ::ng-deep .mat-mdc-dialog-surface {
        background: transparent;
        box-shadow: none;
      }
    `,
  ],
})
export class MaterialPopupComponent implements OnInit {
  @ViewChild('content', { read: ViewContainerRef }) content!: ViewContainerRef;
  private componentRef: ComponentRef<any> | null = null;

  constructor(
    private injector: Injector,
    public dialogRef: MatDialogRef<MaterialPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    if (this.data.component) {
      setTimeout(() => this.loadComponent());
    }
  }

  private loadComponent() {
    this.content.clear();
    const componentFactory = this.injector
      .get(ComponentFactoryResolver)
      .resolveComponentFactory(this.data.component);

    this.componentRef = this.content.createComponent(componentFactory);

    if (this.data.inputs) {
      Object.keys(this.data.inputs).forEach((key) => {
        this.componentRef!.instance[key] = this.data.inputs[key];
      });
    }
  }

  onClose() {
    this.dialogRef.close();
  }

  ngOnDestroy() {
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }

  getPopupBackground() {
    if (this.data.backgroundColor) {
      return this.data.backgroundColor;
    }
    return 'linear-gradient(145deg, #1f2937, #111827)';
  }

  getHeaderBackground() {
    if (this.data.backgroundColor) {
      // Create a slightly darker version for the header
      return this.adjustColorOpacity(this.data.backgroundColor, 0.9);
    }
    return 'rgba(31, 41, 55, 0.8)';
  }

  getContentBackground() {
    if (this.data.backgroundColor) {
      return this.data.backgroundColor;
    }
    return 'linear-gradient(145deg, #1f2937, #111827)';
  }

  // Helper method to adjust color opacity
  adjustColorOpacity(color: string, opacity: number): string {
    // If color is hex, convert to rgba
    if (color.startsWith('#')) {
      const hex = color.replace('#', '');
      const r = parseInt(hex.substr(0, 2), 16);
      const g = parseInt(hex.substr(2, 2), 16);
      const b = parseInt(hex.substr(4, 2), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    // If already rgba/rgb, return as is (simplified)
    return color;
  }
}
