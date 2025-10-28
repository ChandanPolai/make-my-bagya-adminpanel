// dashboard.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiManagerService } from '../utilities/api-manager';
import { apiEndpoints } from '../constants/api-endpoint';
import { DashboardResponse } from '../interfaces/dashboards.interface';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private apiManager: ApiManagerService) {}

  // Get dashboard counts
  getDashboardCounts(): Observable<DashboardResponse> {
    return this.apiManager.post(apiEndpoints.DASHBOARD);
  }
}