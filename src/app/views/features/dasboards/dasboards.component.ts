// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-dasboards',
//   imports: [],
//   templateUrl: './dasboards.component.html',
//   styleUrl: './dasboards.component.scss'
// })
// export class DasboardsComponent {

// }
// dashboards.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../../core/services/dashboards.service';
import { DashboardCounts } from '../../../core/interfaces/dashboards.interface';
import { SidebarService } from '../../../core/services/sidebar.service';
import { swalHelper } from '../../../core/constants/swal-helper';

@Component({
  selector: 'app-dashboards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dasboards.component.html',
  styleUrls: ['./dasboards.component.scss']
})
export class DashboardsComponent implements OnInit {
  isLoading: boolean = false;
  isSidebarCollapsed: boolean = false;
  dashboardData: DashboardCounts | null = null;

  constructor(
    private dashboardService: DashboardService,
    private sidebarService: SidebarService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
    this.sidebarService.isCollapsed$.subscribe((isCollapsed) => {
      this.isSidebarCollapsed = isCollapsed;
    });
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
}