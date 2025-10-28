import { Component, EventEmitter, Output } from '@angular/core';
import { NotificationData, Notification } from '../../../core/interfaces/notification.interface'
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { common } from '../../../core/constants/common';
import { DebounceDirective } from '../../../core/directives/debounce';
import { AppStorage } from '../../../core/utilities/app-storage';
import { NotificationService } from '../../../core/services/notification.service';
import { SidebarService } from '../../../core/services/sidebar.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxPaginationModule,
    NgSelectModule
],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
})
export class NotificationComponent {
  // Notifications data
  notifications: Notification[] = [];
  totalNotifications = 0;
  isNotificationsLoading: boolean = true;
  userRole: string = '';
  roleDisplayName: string = '';

  // Notifications pagination
  notificationsPayload = {
    search: null as string | null,
    page: 1,
    limit: 10,
    role: null as string | null,
  };

  // Modal states
  isNotificationDetailsModalOpen: boolean = false;
  selectedNotification: Notification | null = null;
  userData: any;
  filteredNotifications: any;

  constructor(
    private notificationService: NotificationService,
    private storage: AppStorage,
    private sidebarService: SidebarService
  ) {}

  ngOnInit(): void {
    this.userData = this.storage.get(common.USERDATA);
    this.userRole = this.userData?.role?.toLowerCase() || '';
    this.notificationsPayload.role = this.userRole;
    
    // Set display name based on role
    this.roleDisplayName = this.getRoleDisplayName(this.userRole);
    
    this.loadNotifications();
    this.sidebarService.isCollapsed$.subscribe((isCollapsed) => {
      this.isSidebarCollapsed = isCollapsed;
    });
  }
  
  isSidebarCollapsed = false;
  @Output() toggleSidebar = new EventEmitter<void>();

  private getRoleDisplayName(role: string): string {
    switch(role) {
      case 'candidate': return 'Candidate';
      case 'vendor': return 'Vendor';
      default: return '';
    }
  }

  loadNotifications(): void {
    this.isNotificationsLoading = true;
    this.notificationService
      .getNotifications({
        ...this.notificationsPayload,
        role: this.userRole
      })
      .subscribe({
        next: (result) => {
          this.notifications = result.data.notifications;
          this.totalNotifications = result.data.total;
          this.isNotificationsLoading = false;
        },
        error: (error) => {
          console.error('Error loading notifications:', error);
          this.isNotificationsLoading = false;
        },
      });
  }

  onNotificationsSearch(): void {
    this.notificationsPayload.page = 1;
    this.loadNotifications();
  }

  onNotificationsPageChange(page: number): void {
    this.notificationsPayload.page = page;
    this.loadNotifications();
  }

  openNotificationDetailsModal(notification: Notification): void {
    this.selectedNotification = notification;
    this.isNotificationDetailsModalOpen = true;

    if (notification.status === 'unread') {
      this.markAsRead(notification._id);
    }
  }

  closeNotificationDetailsModal(): void {
    this.isNotificationDetailsModalOpen = false;
    this.selectedNotification = null;
  }

  markAsRead(notificationId: string): void {
    this.notificationService.markAsRead(notificationId).subscribe({
      next: (result) => {
        // Update the notification status in the local array
        const index = this.notifications.findIndex(n => n._id === notificationId);
        if (index !== -1) {
          this.notifications[index].status = 'read';
        }
        
        if (this.selectedNotification) {
          this.selectedNotification.status = 'read';
        }
      },
      error: (error) => {
        console.error('Error marking notification as read:', error);
      },
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

   getNotificationIcon(eventType?: string): string {
    if (!eventType) return 'ph ph-bell';
    
    switch(eventType) {
      case 'JD_UPLOADED': 
        return 'ph ph-file-plus';
      case 'INTERVIEW_STATUS_UPDATED':
        return 'ph ph-calendar-check';
      case 'APPLICATION_SUBMITTED':
        return 'ph ph-paper-plane';
      case 'PROFILE_UPDATED':
        return 'ph ph-user-gear';
      case 'VENDOR_ASSIGNED':
        return 'ph ph-handshake';
      case 'CANDIDATE_REGISTERED':
        return 'ph ph-user-plus';
      case 'CANDIDATE_ADDED_BY_VENDOR':
        return 'ph ph-users';
      case 'JOB_APPLIED_BY_VENDOR':
        return 'ph ph-briefcase';
      case 'INTERVIEW_SCHEDULED':
        return 'ph ph-calendar';
      case 'ONBOARDING_INITIATED':
        return 'ph ph-rocket';
      case 'INTERVIEW_UPDATED':
        return 'ph ph-calendar-x';
      default: 
        return 'ph ph-bell';
    }
  }

  // Get notification icon background color
  getNotificationIconBackground(eventType?: string): string {
    if (!eventType) return 'tw-bg-gray-100 tw-text-gray-600';
    
    switch(eventType) {
      case 'JD_UPLOADED': 
        return 'tw-bg-blue-400 tw-text-blue-600';
      case 'INTERVIEW_STATUS_UPDATED':
        return 'tw-bg-green-100 tw-text-green-600';
      case 'APPLICATION_SUBMITTED':
        return 'tw-bg-purple-100 tw-text-purple-600';
      case 'PROFILE_UPDATED':
        return 'tw-bg-indigo-100 tw-text-indigo-600';
      case 'VENDOR_ASSIGNED':
        return 'tw-bg-orange-100 tw-text-orange-600';
      case 'CANDIDATE_REGISTERED':
        return 'tw-bg-emerald-100 tw-text-emerald-600';
      case 'CANDIDATE_ADDED_BY_VENDOR':
        return 'tw-bg-blue-400 tw-text-indigo-800';
      case 'JOB_APPLIED_BY_VENDOR':
        return 'tw-bg-violet-100 tw-text-violet-600';
      case 'INTERVIEW_SCHEDULED':
        return 'tw-bg-red-100 tw-text-red-600';
      case 'ONBOARDING_INITIATED':
        return 'tw-bg-pink-100 tw-text-pink-600';
      case 'INTERVIEW_UPDATED':
        return 'tw-bg-amber-100 tw-text-amber-600';
      default: 
        return 'tw-bg-gray-100 tw-text-gray-600';
    }
  }

  // Get notification text color for arrows
  getNotificationTextColor(eventType?: string): string {
    if (!eventType) return 'tw-text-gray-600';
    
    switch(eventType) {
      case 'JD_UPLOADED': 
        return 'tw-text-blue-600';
      case 'INTERVIEW_STATUS_UPDATED':
        return 'tw-text-green-600';
      case 'APPLICATION_SUBMITTED':
        return 'tw-text-purple-600';
      case 'PROFILE_UPDATED':
        return 'tw-text-indigo-600';
      case 'VENDOR_ASSIGNED':
        return 'tw-text-orange-600';
      case 'CANDIDATE_REGISTERED':
        return 'tw-text-emerald-600';
      case 'CANDIDATE_ADDED_BY_VENDOR':
        return 'tw-text-cyan-600';
      case 'JOB_APPLIED_BY_VENDOR':
        return 'tw-text-violet-600';
      case 'INTERVIEW_SCHEDULED':
        return 'tw-text-red-600';
      case 'ONBOARDING_INITIATED':
        return 'tw-text-pink-600';
      case 'INTERVIEW_UPDATED':
        return 'tw-text-amber-600';
      default: 
        return 'tw-text-gray-600';
    }
  }

  // Get priority border class for cards
  getPriorityClass(eventType?: string): string {
    if (!eventType) return '';
    
    const highPriority = ['INTERVIEW_SCHEDULED', 'INTERVIEW_UPDATED', 'INTERVIEW_STATUS_UPDATED'];
    const mediumPriority = ['APPLICATION_SUBMITTED', 'JD_UPLOADED', 'VENDOR_ASSIGNED'];
    
    if (highPriority.includes(eventType)) {
      return 'tw-border-l-4 tw-border-l-red-500';
    }
    if (mediumPriority.includes(eventType)) {
      return 'tw-border-l-4 tw-border-l-orange-500';
    }
    return 'tw-border-l-4 tw-border-l-green-500';
  }

  formatEventType(eventType?: string): string {
    if (!eventType) return '';
    return eventType
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  }

  getRelativeTime(dateString: string): string {
    const now = new Date();
    const notificationDate = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - notificationDate.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 604800) {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else {
      return this.formatDate(dateString);
    }
  }
getCompanyName(notification: Notification): string {
    return notification?.relatedId?.company || '';
  }


  getTodayNotificationsCount(): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return this.notifications.filter(notification => {
      const notificationDate = new Date(notification.createdAt);
      notificationDate.setHours(0, 0, 0, 0);
      return notificationDate.getTime() === today.getTime();
    }).length;
  }
  getTotalNotificationsCount(): number {
    return this.totalNotifications;
  }
}

