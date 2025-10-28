import { Injectable } from '@angular/core';
import { ApiManagerService } from '../utilities/api-manager';
import { apiEndpoints } from '../constants/api-endpoint';
import { AppStorage } from '../utilities/app-storage';
import { Observable } from 'rxjs';
import { ResponseModel } from '../utilities/response-model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
      private apiManager: ApiManagerService,
      private storage: AppStorage
    ) { }

     getNotifications(data: any): Observable<ResponseModel> {
        return this.apiManager.post(apiEndpoints.GET_NOTIFICATION, data)
      }
    
      markAsRead(data: any): Observable<ResponseModel> {
        return this.apiManager.post(apiEndpoints.READ_NOTIFICATION, data)
      }
      
      getInterviewTimeline(data: any): Observable<ResponseModel> {
        return this.apiManager.post(apiEndpoints.GET_INTERVIEW_DETAILS, data)
      }
}
