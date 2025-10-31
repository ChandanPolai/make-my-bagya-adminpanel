import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxDaterangepickerBootstrapDirective, NgxDaterangepickerBootstrapComponent } from 'ngx-daterangepicker-bootstrap';
import { SidebarService } from '../../../core/services/sidebar.service';
import { DashboardService } from '../../../core/services/dashboards.service';
import { DashboardStats } from '../../../core/interfaces/dashboards.interface';
import moment, { Moment } from 'moment';
import { swalHelper } from '../../../core/constants/swal-helper';
import { Router } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    NgxDaterangepickerBootstrapDirective,
    NgxDaterangepickerBootstrapComponent,
    BaseChartDirective
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

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

  // ==================== CHART CONFIGURATIONS ====================
  
  // Line Chart - Earnings Trend
  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'Total Earnings',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderColor: 'rgba(16, 185, 129, 1)',
        pointBackgroundColor: 'rgba(16, 185, 129, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(16, 185, 129, 1)',
        fill: 'origin',
        tension: 0.4
      }
    ],
    labels: []
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: {
            size: 12,
            weight: 'bold'
          },
          color: '#1F2937'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          label: function(context) {
            return '₹' + ((context.parsed?.y ?? 0).toFixed(2));
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '₹' + value;
          },
          color: '#6B7280',
          font: {
            size: 11
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        ticks: {
          color: '#6B7280',
          font: {
            size: 11
          }
        },
        grid: {
          display: false
        }
      }
    }
  };

  public lineChartType: ChartType = 'line';

  // Bar Chart - User Growth
  public barChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'New Users',
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: 'rgba(59, 130, 246, 1)'
      }
    ],
    labels: []
  };

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: {
            size: 12,
            weight: 'bold'
          },
          color: '#1F2937'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#6B7280',
          font: {
            size: 11
          },
          stepSize: 1
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        ticks: {
          color: '#6B7280',
          font: {
            size: 11
          }
        },
        grid: {
          display: false
        }
      }
    }
  };

  public barChartType: ChartType = 'bar';

  // Doughnut Chart - Revenue Distribution
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: ['Period Earnings', 'Other Earnings'],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(156, 163, 175, 0.3)'
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(156, 163, 175, 0.5)'
        ],
        borderWidth: 2,
        hoverBackgroundColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(156, 163, 175, 0.5)'
        ]
      }
    ]
  };

  public doughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          font: {
            size: 12,
            weight: 'bold'
          },
          color: '#1F2937',
          padding: 15
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        },
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            return label + ': ₹' + value.toFixed(2);
          }
        }
      }
    }
  };

  public doughnutChartType: ChartType = 'doughnut';

  // Pie Chart - Services Distribution
  public pieChartData: ChartData<'pie'> = {
    labels: ['Active Services', 'Inactive Services'],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(239, 68, 68, 0.3)'
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(239, 68, 68, 0.5)'
        ],
        borderWidth: 2,
        hoverBackgroundColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(239, 68, 68, 0.5)'
        ]
      }
    ]
  };

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          font: {
            size: 12,
            weight: 'bold'
          },
          color: '#1F2937',
          padding: 15
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13
        }
      }
    }
  };

  public pieChartType: ChartType = 'pie';

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
        
        // Update charts with new data
        this.updateCharts();
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
   * Update all charts with dashboard data
   */
  updateCharts(): void {
    if (!this.dashboardData) return;

    console.log('📈 Updating charts...');

    // Generate mock data for demonstration
    const days = this.getDaysBetweenDates();
    
    // Update Line Chart - Earnings Trend
    this.lineChartData.labels = days;
    this.lineChartData.datasets[0].data = this.generateEarningsData(days.length);

    // Update Bar Chart - User Growth
    this.barChartData.labels = days;
    this.barChartData.datasets[0].data = this.generateUserGrowthData(days.length);

    // Update Doughnut Chart - Revenue Distribution
    const periodEarnings = this.dashboardData.dateRange?.earnings || 0;
    const totalEarnings = this.dashboardData.totalEarnings || 0;
    const otherEarnings = totalEarnings - periodEarnings;
    
    this.doughnutChartData.datasets[0].data = [periodEarnings, otherEarnings > 0 ? otherEarnings : 0];

    // Update Pie Chart - Services Distribution
    const activeServices = this.dashboardData.totalServices || 0;
    const inactiveServices = Math.floor(activeServices * 0.2); // Assume 20% inactive
    
    this.pieChartData.datasets[0].data = [activeServices, inactiveServices];

    // Refresh charts
    this.chart?.update();
    
    console.log('✅ Charts updated successfully');
  }

  /**
   * Get days between selected date range
   */
  getDaysBetweenDates(): string[] {
    const days: string[] = [];
    const start = this.selected.start.clone();
    const end = this.selected.end.clone();
    
    while (start.isSameOrBefore(end, 'day')) {
      days.push(start.format('DD MMM'));
      start.add(1, 'day');
    }
    
    // Limit to 15 days for better visualization
    if (days.length > 15) {
      const step = Math.ceil(days.length / 15);
      return days.filter((_, index) => index % step === 0);
    }
    
    return days;
  }

  /**
   * Generate mock earnings data (replace with real API data)
   */
  generateEarningsData(length: number): number[] {
    const baseEarnings = (this.dashboardData?.totalEarnings || 1000) / length;
    return Array.from({ length }, () => 
      baseEarnings + (Math.random() * baseEarnings * 0.5)
    );
  }

  /**
   * Generate mock user growth data (replace with real API data)
   */
  generateUserGrowthData(length: number): number[] {
    const baseUsers = Math.ceil((this.dashboardData?.dateRange?.newUsers || 10) / length);
    return Array.from({ length }, () => 
      Math.max(0, baseUsers + Math.floor(Math.random() * baseUsers))
    );
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

    let startDate = event?.start || event?.startDate || event?.chosenLabel;
    let endDate = event?.end || event?.endDate;

    console.log('🔍 Extracted from event:', { startDate, endDate });

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

      const datesChanged = 
        !this.selected.start.isSame(newStart, 'day') || 
        !this.selected.end.isSame(newEnd, 'day');

      console.log('🔄 Dates changed?', datesChanged);

      if (datesChanged || true) {
        this.selected = {
          start: newStart,
          end: newEnd
        };

        console.log('✨ Calling API with new date range...');
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