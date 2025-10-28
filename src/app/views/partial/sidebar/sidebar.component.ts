import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { MenuItem, Theme } from '../../../core/interfaces/sidebar.interface';
import { AppStorage } from '../../../core/utilities/app-storage';
import { common } from '../../../core/constants/common';
import { ThemeService } from '../../../core/services/theme.service';
import { filter } from 'rxjs';
import { swalHelper } from '../../../core/constants/swal-helper';
@Component({
  selector: 'app-sidebar',
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {

  @Input() isCollapsed = false;
  @Output() menuItemClick = new EventEmitter<string>();
  @Output() toggleSidebar = new EventEmitter<void>();

  showColorPicker = false;
  activeMenuItem = 'dashboard';
  expandedMenus: Set<string> = new Set();
  admin: any;

  constructor(public themeService: ThemeService, private router: Router, private storage: AppStorage ,private authservice: AuthService,) { }
    // { path: 'register', component: RegisterComponent },
    //   { path: 'users', component: UsersComponent },
    //   { path: 'category', component: CategoryComponent },
    //   { path: 'subcategory', component: SubcategoryComponent },
    //   { path: 'videos', component: VideosComponent },

  menuItems: MenuItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: 'ph ph-house',
      route: '/dashboard'
    },
    {
      id: 'users',
      label: 'Users',
      icon: 'ph ph-users',
      route: '/users'
    },
    { id: 'services',
      label: 'Services',
      icon: 'ph ph-briefcase',
      route: '/services'
    },
    { id: 'transcation',
      label: 'Transcation',
      icon: 'ph ph-money',
      route: '/transcation'
    },


    
    // {
    //   id: 'scheduled',
    //   label: 'Job',
    //   icon: 'ph ph-calendar',
    //   route: '/job/job-details'
    // },
    // {
    //   id: 'completed',
    //   label: 'Job Applicants',
    //   icon: 'ph ph-check',
    //   route: '/job/job-application'
    // },
    // {
    //   id: 'candidates',
    //   label: 'Candidates',
    //   icon: 'ph ph-users',
    //   route: '/candidate'
    // },
    // {
    //   id: 'interviews',
    //   label: 'Interviews',
    //   icon: 'ph ph-video-camera',
    //   children: [
    //     { id: 'interview-list', label: 'interview List', icon: 'ph ph-users-four', route: '/interview/interview-list' },
    //     { id: 'interviewRound', label: 'Interview Round', icon: 'ph ph-user-circle', route: '/interview/interviewRound' }
    //   ]
    // },
    // {
    //   id: 'vendors',
    //   label: 'Vendors',
    //   icon: 'ph ph-buildings',
    //   route: '/vendors'
    // },
    // {
    //   id: 'onboarding',
    //   label: 'Onboarding',
    //   icon: 'ph ph-user-plus',
    //   route: '/onboarding',
    //   // badge: '3'
    // },
    // {
    //   id: 'project',
    //   label: 'Projects',
    //   icon: 'ph ph-chart-line',
    //   // route: '/post-project',
    //    children: [
    //     { id: 'post-project', label: 'Post Project', icon: 'ph ph-numpad', route: '/post-project' },
    //     { id: 'project-bids', label: 'Project Bids', icon: 'ph ph-user-circle', route: '/project-bids' }
    //   ]

    // },
    {
      id: 'settings',
      label: 'Settings',
      icon: 'ph ph-gear',
      // route: '/settings',
      children: [
        { id: 'passsword', label: 'Change Password', icon: 'ph ph-numpad', route: '/settings/change-password' },
        { id: 'userProfile', label: 'User Profile', icon: 'ph ph-user-circle', route: '/settings/user-profile' }
      ]
    },
    
    {
      id: 'sign-out',
      label: 'Sign Out',
      icon: 'ph ph-sign-out',
      // route: '/sign-in',

    }
  ];


  get colorThemes(): Theme[] {
    return this.themeService.getThemes();
  }

  get currentTheme(): Theme {
    return this.themeService.getCurrentTheme();
  }

  toggleSubmenu(menuId: string): void {
    if (this.expandedMenus.has(menuId)) {
      this.expandedMenus.delete(menuId);
    } else {
      this.expandedMenus.add(menuId);
    }
  }

  selectMenuItem(menuId: string): void {
    this.activeMenuItem = menuId;
    this.menuItemClick.emit(menuId);
  }

  changeTheme(theme: Theme): void {
    this.themeService.setTheme(theme);
    this.showColorPicker = false;
  }

  toggleColorPicker(): void {
    this.showColorPicker = !this.showColorPicker;
  }

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
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
    }
    
  ngOnInit(): void {
    this.setActiveMenuFromRoute(this.router.url);
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.setActiveMenuFromRoute(event.urlAfterRedirects || event.url);
      });

    this.admin = this.storage.get(common.USERDATA)

  }

  private setActiveMenuFromRoute(url: string): void {
    const baseUrl = url.split('?')[0].split('#')[0];

    const findActiveItem = (items: MenuItem[]): string | null => {
      for (const item of items) {
        // 1. Check exact match first
        if (item.route && baseUrl === item.route) {
          return item.id;
        }

        // 2. Recursively check children
        if (item.children) {
          const childMatch = findActiveItem(item.children);
          if (childMatch) {
            this.expandedMenus.add(item.id);
            return childMatch;
          }
        }
      }

      // 3. Check for partial matches (fallback)
      for (const item of items) {
        if (item.route && baseUrl.startsWith(item.route)) {
          return item.id;
        }
      }

      return null;
    };

    const activeId = findActiveItem(this.menuItems);
    if (activeId) {
      this.activeMenuItem = activeId;
    }
  }

}


