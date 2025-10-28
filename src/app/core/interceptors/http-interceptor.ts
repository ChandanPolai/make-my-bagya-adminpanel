import { HttpRequest, HttpHandlerFn, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { inject } from '@angular/core';
import { AppStorage } from '../utilities/app-storage';
import { common } from '../constants/common';

export function headerInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const storage = inject(AppStorage);
  const token = storage.get(common.TOKEN);
  
  let headers = new HttpHeaders({
    'Authorization': token ? `Bearer ${token}` : '',
  });

  if (!(req.body instanceof FormData)) {
    headers = headers.set('Content-Type', 'application/json');
  }

  const modifiedReq = req.clone({ headers });
  return next(modifiedReq).pipe(
    catchError((error: any) => {
      if (error.status === 401) {
        console.error('Unauthorized request');
      }
      return throwError(() => error);
    })
  );
}