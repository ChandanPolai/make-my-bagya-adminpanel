//src\app\core\services\dashboard.service.ts

import { Injectable } from '@angular/core';
import { ApiManagerService } from '../utilities/api-manager';
import { Observable } from 'rxjs';
import { ResponseModel } from '../utilities/response-model';
import { apiEndpoints } from '../constants/api-endpoint';
import { DashboardDetails } from '../interfaces/dashboard.interface';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor( private apiManager :ApiManagerService) { }

  getCountDetails(data:any):Observable<ResponseModel>{
    return this.apiManager.post(apiEndpoints.GET_COUNT_DASHBORD_DETAILS,data)
  }

  getRecentActiveJD(data:any):Observable<ResponseModel>{
    return this.apiManager.post(apiEndpoints.GET_RECENT_ACTIVE_JD)
  }

  getRecentActiveCandidate(data:any):Observable<ResponseModel>{
    return this.apiManager.post(apiEndpoints.GET_RECENT_CANDIDATE)
  }
}
