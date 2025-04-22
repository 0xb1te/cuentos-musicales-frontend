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
    <div class="popup-container">
      <div class="header-container">
        <h2 mat-dialog-title>{{ data.title }}</h2>
        <button mat-icon-button (click)="onClose()" class="close-button">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      <mat-dialog-content>
        <ng-container #content></ng-container>
      </mat-dialog-content>
    </div>
  `,
  styles: [
    `
      .popup-container {
        padding: 20px;
        min-width: 300px;
      }
      .header-container {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
      }
      h2 {
        margin: 0;
      }
      .close-button {
        color: #ef4444;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        transition: background-color 0.2s;
        padding: 0;
        margin: 0;
        min-width: 40px;
        line-height: 40px;
      }
      .close-button:hover {
        background-color: #fee2e2;
      }
      .close-button mat-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
        line-height: 24px;
        margin: 0;
        padding: 0;
      }
      :host ::ng-deep .mat-mdc-icon-button {
        padding: 0;
        min-width: 40px;
        width: 40px;
        height: 40px;
        line-height: 40px;
      }
    `,
  ],
})
export class MaterialPopupComponent implements OnInit {
  private componentRef: ComponentRef<any> | null = null;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private injector: Injector,
    public dialogRef: MatDialogRef<MaterialPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    if (this.data.component) {
      this.loadComponent();
    }
  }

  private loadComponent() {
    this.viewContainerRef.clear();
    const componentFactory = this.injector
      .get(ComponentFactoryResolver)
      .resolveComponentFactory(this.data.component);

    this.componentRef = this.viewContainerRef.createComponent(componentFactory);

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
}
