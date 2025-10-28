import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarService } from '../../../core/services/sidebar.service';
import { DashboardService } from '../../../core/services/dashboards.service';
import { DashboardCounts } from '../../../core/interfaces/dashboards.interface';
import { swalHelper } from '../../../core/constants/swal-helper';
import { Router } from '@angular/router'; // Import the Router type


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  isSidebarCollapsed = false;
  isLoading: boolean = false;
  dashboardData: DashboardCounts | null = null;

  constructor(
    private sidebarService: SidebarService,
    private dashboardService: DashboardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sidebarService.isCollapsed$.subscribe((isCollapsed) => {
      this.isSidebarCollapsed = isCollapsed;
    });
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.isLoading = true;
    this.dashboardService.getDashboardCounts().subscribe({
      next: (response) => {
        this.dashboardData = response.data;
        this.isLoading = false;
      },
      error: (err) => {
        swalHelper.messageToast(err?.message ?? 'Failed to load dashboard data.', 'error');
        this.isLoading = false;
      }
    });
  }

  refreshData(): void {
    this.loadDashboardData();
  }

  // Utility method to calculate percentage
  getPercentage(part: number, total: number): number {
    return total > 0 ? Math.round((part / total) * 100) : 0;
  }

  // Navigation methods for quick actions
  navigateToUsers(): void {
    this.router.navigate(['/users']);
  }

  navigateToVideos(): void {
    this.router.navigate(['/videos']);
  }

  navigateToCategories(): void {
    this.router.navigate(['/category']);
  }

  navigateToSubCategories(): void {
    this.router.navigate(['/subcategory']);
  }

  navigateToServices(): void {
    this.router.navigate(['/services']);
  }

  navigateToRegister(): void {
    this.router.navigate(['/users']);
  }
}