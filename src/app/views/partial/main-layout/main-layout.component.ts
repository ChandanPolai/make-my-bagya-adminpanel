import { Component, output } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { DashboardComponent } from '../../features/dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { AppStorage } from '../../../core/utilities/app-storage';
import { common } from '../../../core/constants/common';
import { Theme } from '../../../core/interfaces/sidebar.interface';
import { ThemeService } from '../../../core/services/theme.service';
import { ChangePasswordComponent } from "../change-password/change-password.component";
import { SidebarService } from '../../../core/services/sidebar.service';

@Component({
  selector: 'app-main-layout',
  imports: [SidebarComponent, HeaderComponent, RouterModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
  constructor(
    public themeService: ThemeService,
    private sidebarService:SidebarService
  ) {
    this.sidebarService.isCollapsed$.subscribe(isCollapsed => {
      this.isSidebarCollapsed = isCollapsed;
    });
  }
  isSidebarCollapsed = false;


}
