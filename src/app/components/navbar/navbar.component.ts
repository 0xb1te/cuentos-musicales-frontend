import { CommonModule } from '@angular/common';
import {
  Component,
  Output,
  EventEmitter,
  Input,
  OnChanges,
  SimpleChanges,
  OnInit,
  ChangeDetectorRef,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Service for sidebar communication
export class SidebarService {
  onToggle?: () => void;

  setToggleHandler(handler: () => void) {
    this.onToggle = handler;
  }

  toggle() {
    if (this.onToggle) {
      this.onToggle();
    }
  }
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  providers: [SidebarService],
})
export class NavbarComponent implements OnChanges, OnInit {
  @Input() sidebarOpen = false;
  @Output() toggleSidebarEvent = new EventEmitter<void>();
  @Output() closeSidebarEvent = new EventEmitter<void>();

  constructor(
    private sidebarService: SidebarService,
    private cdr: ChangeDetectorRef,
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    console.log('Navbar: ngOnInit - initial sidebarOpen:', this.sidebarOpen);
    this.updateNavbarVisibility();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['sidebarOpen']) {
      console.log(
        'Navbar: sidebarOpen changed from:',
        changes['sidebarOpen'].previousValue,
        'to:',
        changes['sidebarOpen'].currentValue
      );
      this.updateNavbarVisibility();
      // Force change detection
      this.cdr.detectChanges();
    }
  }

  private updateNavbarVisibility() {
    const navElement = this.el.nativeElement.querySelector('nav');
    if (navElement) {
      if (this.sidebarOpen) {
        console.log('Navbar: Adding hidden class');
        this.renderer.addClass(navElement, 'navbar-hidden');
        this.renderer.setAttribute(navElement, 'data-hidden', 'true');
      } else {
        console.log('Navbar: Removing hidden class');
        this.renderer.removeClass(navElement, 'navbar-hidden');
        this.renderer.removeAttribute(navElement, 'data-hidden');
      }
    }
  }

  toggleSidebar(): void {
    console.log('Navbar: Toggling sidebar, current state:', this.sidebarOpen);
    this.toggleSidebarEvent.emit();
    this.sidebarService.toggle();

    if ((window as any).appToggleSidebar) {
      (window as any).appToggleSidebar();
    }
  }

  closeSidebar(): void {
    console.log('Navbar: Closing sidebar');
    this.closeSidebarEvent.emit();
  }
}
