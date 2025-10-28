import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiManagerService } from '../utilities/api-manager';
import { apiEndpoints } from '../constants/api-endpoint';
import {
  DashboardStatsResponse,
  GetDashboardStatsRequest
} from '../interfaces/dashboards.interface';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private apiManager: ApiManagerService) {}

  /**
   * Get dashboard statistics
   * @param date - Optional date to get stats for a specific date (defaults to current date if not provided)
   * @returns Observable of dashboard stats
   */
  getDashboardStats(date?: string | Date): Observable<DashboardStatsResponse> {
    const requestData: GetDashboardStatsRequest = date ? { date } : {};
    return this.apiManager.post(apiEndpoints.DASHBOARD_STATS, requestData);
  }
}