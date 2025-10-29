import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarService } from '../../../core/services/sidebar.service';
import { DashboardService } from '../../../core/services/dashboards.service';
import { DashboardStats } from '../../../core/interfaces/dashboards.interface';
import { swalHelper } from '../../../core/constants/swal-helper';
import { Router } from '@angular/router';

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
  dashboardData: DashboardStats | null = null;
  selectedDate: Date = new Date(); // Current date by default

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

  /**
   * Load dashboard statistics
   * @param date - Optional date to load stats for specific date
   */
  loadDashboardData(date?: Date): void {
    this.isLoading = true;
    this.dashboardService.getDashboardStats(date).subscribe({
      next: (response) => {
        this.dashboardData = response.data;
        this.isLoading = false;
      },
      error: (err) => {
        swalHelper.messageToast(
          err?.error?.message ?? 'Failed to load dashboard data.',
          'error'
        );
        this.isLoading = false;
      },
    });
  }

  /**
   * Refresh dashboard data
   */
  refreshData(): void {
    this.loadDashboardData(this.selectedDate);
  }

  /**
   * Change date and reload dashboard data
   * @param event - Date input event
   */
  onDateChange(event: any): void {
    const newDate = new Date(event.target.value);
    this.selectedDate = newDate;
    this.loadDashboardData(newDate);
  }

  /**
   * Format earnings from paise to rupees
   * @param amount - Amount in paise
   * @returns Formatted amount in rupees
   */
  formatEarnings(amount: number): string {
    return amount.toFixed(2);
  }

  /**
   * Format large numbers (e.g., 1000 -> 1K, 1000000 -> 1M)
   */
  formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  // Navigation methods for quick actions
  navigateToUsers(): void {
    this.router.navigate(['/users']);
  }

  navigateToServices(): void {
    this.router.navigate(['/services']);
  }

  navigateToPaymentLogs(): void {
    this.router.navigate(['/transcation']);
  }

}