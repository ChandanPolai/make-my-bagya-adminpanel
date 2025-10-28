import { Injectable } from '@angular/core';
import { ApiManagerService } from '../utilities/api-manager';
import { Observable, tap } from 'rxjs';
import { ResponseModel } from '../utilities/response-model';
import { apiEndpoints } from '../constants/api-endpoint';
import { swalHelper } from '../constants/swal-helper';
import { AppStorage } from '../utilities/app-storage';
import { common } from '../constants/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private apiManager: ApiManagerService,
    private storage: AppStorage
  ) { }

  signIn(credentials: { email: string; password: string }): Observable<ResponseModel> {
    return this.apiManager.post(apiEndpoints.SIGN_IN, credentials).pipe(
      tap((response) => {
        this.storage.clearAll()
        if (response.data?.token) {
          this.storage.set(common.TOKEN, response.data.token);
        }
        if(response.data.admin){
          this.storage.set(common.USERDATA,response.data.admin)
        }
      })
    );
  }

  changePassword(data:any):Observable<ResponseModel>{
    return this.apiManager.post(apiEndpoints.CHANGE_PASSWORD,data)
  }

  updateAdminProfile(data:any):Observable<ResponseModel>{
    return this.apiManager.post(apiEndpoints.UPDATE_PROFILE,data)
  }


  logoutUser():Observable<ResponseModel>{
    return this.apiManager.post(apiEndpoints.LOGOUT)
  }

  getProfile(data:any):Observable<ResponseModel>{
    return this.apiManager.post(apiEndpoints.PROFILE)
  }
}

