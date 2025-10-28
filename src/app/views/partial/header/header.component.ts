import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  HostListener,
  ElementRef,
} from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';
import { Theme } from '../../../core/interfaces/sidebar.interface';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { swalHelper } from '../../../core/constants/swal-helper';
import { AppStorage } from '../../../core/utilities/app-storage';
import { common } from '../../../core/constants/common';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../../env/env.local';
import { SidebarService } from '../../../core/services/sidebar.service';

@Component({
  selector: 'app-header',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  constructor(
    public themeService: ThemeService,
    private authservice: AuthService,
    private router: Router,
    private storage: AppStorage,
    private elementRef: ElementRef,
    private sidebarService: SidebarService
  ) {}

  isDarkMode: boolean = false;

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showProfileDropdown = false;
    }
  }

  admin: any;

  ngOnInit(): void {
    this.admin = this.storage.get(common.USERDATA);
  }

  @Input() isCollapsed = false;

  toggleSidebar() {
    this.sidebarService.toggleSidebar();
  }

  @Output() profileClick = new EventEmitter<void>();

  showProfileDropdown = false;

  getImageUrl(url: string) {
    return environment.imageUrl + url;
  }

  toggleProfileDropdown(event: Event) {
    event.stopPropagation();
    this.showProfileDropdown = !this.showProfileDropdown;
  }

  _logoutUser(): void {
    this.authservice.logoutUser().subscribe({
      next: (response) => {
        this.storage.clearAll();
        swalHelper.showToast(response.message, 'success');
        this.router.navigate(['/sign-in']);
      },
      error: (err) => {
        console.error('Failed to LogOut', err);
      },
    });
    this.showProfileDropdown = false;
  }

  get currentTheme(): Theme {
    return this.themeService.getCurrentTheme();
  }
}