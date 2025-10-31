import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxDaterangepickerBootstrapDirective, NgxDaterangepickerBootstrapComponent } from 'ngx-daterangepicker-bootstrap';
import { SidebarService } from '../../../core/services/sidebar.service';
import { DashboardService } from '../../../core/services/dashboards.service';
import { DashboardStats } from '../../../core/interfaces/dashboards.interface';
import moment, { Moment } from 'moment';
import { swalHelper } from '../../../core/constants/swal-helper';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    NgxDaterangepickerBootstrapDirective,
    NgxDaterangepickerBootstrapComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  isSidebarCollapsed = false;
  isLoading: boolean = false;
  dashboardData: DashboardStats | null = null;
  
  // Date range picker configuration
  selected: { start: Moment; end: Moment } = {
    start: moment().startOf('day'),
    end: moment().endOf('day')
  };

  // Predefined ranges for quick selection
  ranges: any = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
  };

  private isLoadingData = false;

  constructor(
    private sidebarService: SidebarService,
    private dashboardService: DashboardService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sidebarService.isCollapsed$.subscribe((isCollapsed) => {
      this.isSidebarCollapsed = isCollapsed;
    });
    
    console.log('🚀 Dashboard initialized');
    console.log('📅 Initial date range:', {
      start: this.selected.start.format('DD/MM/YYYY'),
      end: this.selected.end.format('DD/MM/YYYY')
    });
    
    // Load initial data
    this.loadDashboardData();
  }

  /**
   * Load dashboard statistics from API
   */
  loadDashboardData(): void {
    if (this.isLoadingData) {
      console.log('⏳ Already loading data, skipping...');
      return;
    }

    this.isLoadingData = true;
    this.isLoading = true;
    
    const fromDate = this.selected.start.clone().startOf('day').toISOString();
    const toDate = this.selected.end.clone().endOf('day').toISOString();
    
    console.log('📡 API Call Started');
    console.log('📅 Date Range:', {
      from: this.selected.start.format('DD/MM/YYYY HH:mm'),
      to: this.selected.end.format('DD/MM/YYYY HH:mm')
    });
    console.log('🔗 ISO Dates:', { fromDate, toDate });
    
    this.dashboardService.getDashboardStats(fromDate, toDate).subscribe({
      next: (response) => {
        console.log('✅ API Response received:', response);
        this.dashboardData = response.data;
        this.isLoading = false;
        this.isLoadingData = false;
        console.log('📊 Dashboard data updated successfully');
      },
      error: (err) => {
        console.error('❌ API Error:', err);
        swalHelper.messageToast(
          err?.error?.message ?? 'Failed to load dashboard data.',
          'error'
        );
        this.isLoading = false;
        this.isLoadingData = false;
      },
    });
  }

  /**
   * Refresh dashboard data manually
   */
  refreshData(): void {
    console.log('🔄 Manual refresh triggered');
    if (!this.isLoadingData) {
      this.loadDashboardData();
    }
  }

  /**
   * Called when user clicks "Apply" button in date picker
   * This method is triggered by datesUpdated event
   */
  onRangeApplied(event: any): void {
    console.log('=================================');
    console.log('🎯 Date Range Apply Event Fired!');
    console.log('📦 Full Event Object:', event);
    console.log('=================================');
    
    if (this.isLoadingData) {
      console.log('⏳ Already loading, ignoring date change');
      return;
    }

    // Extract dates from event - ngx-daterangepicker-bootstrap sends object with start/end
    let startDate = event?.start || event?.startDate || event?.chosenLabel;
    let endDate = event?.end || event?.endDate;

    console.log('🔍 Extracted from event:', { startDate, endDate });

    // If no dates in event, use the selected model (it gets auto-updated)
    if (!startDate || !endDate) {
      console.log('⚠️ No dates in event, using model values');
      startDate = this.selected.start;
      endDate = this.selected.end;
    }

    if (startDate && endDate) {
      const newStart = moment(startDate).startOf('day');
      const newEnd = moment(endDate).endOf('day');
      
      console.log('🆕 New date range:', {
        start: newStart.format('DD/MM/YYYY'),
        end: newEnd.format('DD/MM/YYYY')
      });

      // Check if dates actually changed
      const datesChanged = 
        !this.selected.start.isSame(newStart, 'day') || 
        !this.selected.end.isSame(newEnd, 'day');

      console.log('🔄 Dates changed?', datesChanged);

      if (datesChanged || true) { // Force reload even if same dates (for now)
        // Update the selected range
        this.selected = {
          start: newStart,
          end: newEnd
        };

        console.log('✨ Calling API with new date range...');
        
        // Reload dashboard with new dates
        this.loadDashboardData();
      } else {
        console.log('⚠️ Dates unchanged, skipping API call');
      }
    } else {
      console.warn('⚠️ Invalid date range - missing start or end date');
      console.log('Current selected:', this.selected);
    }
  }

  /**
   * Format earnings from paise to rupees
   */
  formatEarnings(amount: number): string {
    return amount ? amount.toFixed(2) : '0.00';
  }

  /**
   * Format large numbers (1000 -> 1K, 1000000 -> 1M)
   */
  formatNumber(num: number): string {
    if (!num) return '0';
    
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  /**
   * Calculate growth percentage
   */
  calculateGrowthRate(): string {
    if (!this.dashboardData) return '0';
    
    const total = this.dashboardData.totalUsers;
    const newUsers = this.dashboardData.dateRange?.newUsers || 0;
    
    if (total > 0 && newUsers > 0) {
      return ((newUsers / total) * 100).toFixed(1);
    }
    return '0';
  }

  /**
   * Calculate average earnings per user
   */
  calculateAvgPerUser(): string {
    if (!this.dashboardData) return '0.00';
    
    const total = this.dashboardData.totalUsers;
    const earnings = this.dashboardData.totalEarnings;
    
    if (total > 0 && earnings > 0) {
      return (earnings / total).toFixed(2);
    }
    return '0.00';
  }

  // Navigation methods
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