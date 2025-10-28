// import { Injectable } from '@angular/core';
// import { ApiManagerService } from '../utilities/api-manager';
// import { Observable } from 'rxjs';
// import { ResponseModel } from '../utilities/response-model';
// import { apiEndpoints } from '../constants/api-endpoint';
// import { User, PaginatedUserResponse, UserResponse } from '../interfaces/users.interface';

// @Injectable({
//   providedIn: 'root'
// })
// export class UsersService {
//   constructor(private apiManager: ApiManagerService) {}

//   // Get all users with pagination
//   getAllUsers(paginationData: { page: number; limit: number }): Observable<PaginatedUserResponse> {
//     return this.apiManager.post(apiEndpoints.LIST_USERS, paginationData);
//   }

//   // Get user by ID
//   getUserById(id: string): Observable<UserResponse> {
//     return this.apiManager.post(apiEndpoints.GET_USER_BY_ID, { id });
//   }

//    createUser(data: Partial<User> | FormData): Observable<ResponseModel> {
//     return this.apiManager.post(apiEndpoints.CREATE_USER, data);
//   }

//   // Update user
// updateUser(formData: FormData, id: string): Observable<UserResponse> {
//   formData.append("id", id); // 👈 id ko bhi body ke andar bhejna hai
//   return this.apiManager.post(apiEndpoints.UPDATE_USER, formData);
// }



//   // Delete user
//   deleteUser(id: string): Observable<UserResponse> {
//     return this.apiManager.post(apiEndpoints.DELETE_USER, { id });
//   }
// }



import { Injectable } from '@angular/core';
import { ApiManagerService } from '../utilities/api-manager';
import { Observable } from 'rxjs';
import { ResponseModel } from '../utilities/response-model';
import { apiEndpoints } from '../constants/api-endpoint';
import { User, PaginatedUserResponse, UserResponse } from '../interfaces/users.interface';
import { SendNotificationRequest, NotificationResponse } from '../interfaces/usernotification.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(private apiManager: ApiManagerService) {}

  // Get all users with pagination
  getAllUsers(paginationData: { page: number; limit: number; search?: string }): Observable<PaginatedUserResponse> {
    return this.apiManager.post(apiEndpoints.LIST_USERS, paginationData);
  }

  // Get user by ID
  getUserById(id: string): Observable<UserResponse> {
    return this.apiManager.post(apiEndpoints.GET_USER_BY_ID, { id });
  }

  // Create user
  createUser(data: Partial<User> | FormData): Observable<ResponseModel> {
    return this.apiManager.post(apiEndpoints.CREATE_USER, data);
  }

  // Update user
  updateUser(formData: FormData, id: string): Observable<UserResponse> {
    formData.append("id", id);
    return this.apiManager.post(apiEndpoints.UPDATE_USER, formData);
  }

  // Delete user
  deleteUser(id: string): Observable<UserResponse> {
    return this.apiManager.post(apiEndpoints.DELETE_USER, { id });
  }

  // Send notification to users
  sendNotification(data: SendNotificationRequest): Observable<NotificationResponse> {
    return this.apiManager.post(apiEndpoints.SEND_NOTIFICATION, data);
  }
}