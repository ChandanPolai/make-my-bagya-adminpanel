import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, retry, map, switchMap } from 'rxjs/operators';
import { swalHelper } from '../constants/swal-helper';
import { ResponseModel } from './response-model';
import { STATUS_CODES } from '../constants/http-status-code';
import { AppStorage } from './app-storage';

export interface RequestConfig {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  params?: { [key: string]: any };
  headers?: HttpHeaders;
}

@Injectable({
  providedIn: 'root'
})
export class ApiManagerService {
  constructor(private http: HttpClient, private storage: AppStorage) { }

  get<T = ResponseModel>(url: string, params?: { [key: string]: any }): Observable<T> {
    const httpParams = this.buildParams(params);
    return this.http.get<T>(url, { params: httpParams }).pipe(
      retry(1),
      map(response => this.formatResponse(response, STATUS_CODES.success) as T),
      catchError(this.handleError.bind(this))
    );
  }

  post<T = ResponseModel>(url: string, body?: any): Observable<T> {
    return this.http.post<T>(url, body).pipe(
      map(response => this.formatResponse(response, body instanceof FormData ? STATUS_CODES.created : STATUS_CODES.success) as T),
      catchError(this.handleError.bind(this))
    );
  }

  put<T = ResponseModel>(url: string, body?: any): Observable<T> {
    return this.http.put<T>(url, body).pipe(
      map(response => this.formatResponse(response, STATUS_CODES.success) as T),
      catchError(this.handleError.bind(this))
    );
  }

  patch<T = ResponseModel>(url: string, body?: any): Observable<T> {
    return this.http.patch<T>(url, body).pipe(
      map(response => this.formatResponse(response, STATUS_CODES.success) as T),
      catchError(this.handleError.bind(this))
    );
  }

  delete<T = ResponseModel>(url: string): Observable<T> {
    return this.http.delete<T>(url).pipe(
      map(response => this.formatResponse(response, STATUS_CODES.noContent) as T),
      catchError(this.handleError.bind(this))
    );
  }

  downloadFile(url: string, body?: any, defaultFileName: string = 'download'): Observable<Blob> {
    return this.http.post(url, body, { responseType: 'blob', observe: 'response' }).pipe(
      switchMap((response: HttpResponse<Blob>) => {
        // Check if response is JSON (indicating an error)
        const contentType = response.headers.get('Content-Type') || '';
        if (contentType.includes('application/json')) {
          return new Observable<Blob>((observer) => {
            response.body!.text().then((text: string) => {
              try {
                const error = JSON.parse(text);
                observer.error(
                  new HttpErrorResponse({
                    error,
                    status: response.status,
                    statusText: response.statusText
                  })
                );
              } catch (err) {
                observer.error(
                  new HttpErrorResponse({
                    error: { message: 'Failed to parse error response' },
                    status: response.status,
                    statusText: response.statusText
                  })
                );
              }
            }).catch((err) => {
              observer.error(
                new HttpErrorResponse({
                  error: { message: 'Failed to read error response' },
                  status: response.status,
                  statusText: response.statusText
                })
              );
            });
          });
        }

        // Extract file name from Content-Disposition header, if available
        let fileName = defaultFileName;
        const disposition = response.headers.get('Content-Disposition');
        if (disposition) {
          const match = disposition.match(/filename="?(.+?)"?$/i);
          if (match && match[1]) {
            fileName = match[1];
          }
        }

        // Ensure file extension based on Content-Type if filename lacks extension
        if (!fileName.includes('.')) {
          const extension = this.getFileExtension(contentType);
          fileName = `${fileName}${extension}`;
        }

        // Trigger file download
        const blob = response.body as Blob;
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.click();
        window.URL.revokeObjectURL(url);

        return of(blob);
      }),
      catchError(this.handleError.bind(this))
    );
  }

  private getFileExtension(contentType: string): string {
    const mimeTypeMap: { [key: string]: string } = {
      'application/pdf': '.pdf',
      'image/png': '.png',
      'image/jpeg': '.jpg',
      'image/gif': '.gif',
      'image/bmp': '.bmp',
      'image/webp': '.webp',
      'application/msword': '.doc',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
      'application/vnd.ms-excel': '.xls',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
      'text/csv': '.csv',
      'application/zip': '.zip',
      'text/plain': '.txt',
      'application/json': '.json',
      'audio/mpeg': '.mp3',
      'audio/wav': '.wav',
      'video/mp4': '.mp4',
      'video/mpeg': '.mpeg',
      'application/octet-stream': '' // Fallback for unknown types
    };

    return mimeTypeMap[contentType.toLowerCase()] || ''; // Return empty string if no match
  }

  private buildParams(params?: { [key: string]: any }): HttpParams {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }
    return httpParams;
  }

  private formatResponse(response: any, expectedStatus: number): ResponseModel {
    if (response === null || response === undefined) {
      return {
        status: expectedStatus,
        message: expectedStatus === STATUS_CODES.noContent
          ? 'No content found'
          : 'Operation successful',
        data: null
      };
    }

    if (typeof response === 'object') {
      if (Array.isArray(response) && response.length === 0) {
        return {
          status: expectedStatus,
          message: 'No records found',
          data: []
        };
      }

      if (Object.keys(response).length === 0) {
        return {
          status: expectedStatus,
          message: 'No data available',
          data: {}
        };
      }

      if ('status' in response && 'message' in response && 'data' in response) {
        return response as ResponseModel;
      }
    }

    return {
      status: expectedStatus,
      message: 'Success',
      data: response
    };
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const errorResponse = error.error || {};
    const errorMessage = {
      message: errorResponse.message ||
        errorResponse.error?.message ||
        error.message ||
        'An unknown error occurred',
      status: error.status
    };

    const redirectStatuses = [
      STATUS_CODES.unAuthorized,
      STATUS_CODES.forbidden,
      STATUS_CODES.resourceNotAvailable
    ];

    switch (error.status) {
      case STATUS_CODES.unAuthorized:
        errorMessage.message = 'Unauthorized. Please log in again.';
        swalHelper.showToast(errorMessage.message, 'error');
        break;
      case STATUS_CODES.forbidden:
        errorMessage.message = 'Access denied.';
        swalHelper.showToast(errorMessage.message, 'error');
        break;
      case STATUS_CODES.resourceNotAvailable:
        errorMessage.message = 'Resource not found.';
        swalHelper.showToast(errorMessage.message, 'error');
        break;
      case STATUS_CODES.requiredField:
        errorMessage.message = errorResponse.message || 'Invalid input provided.';
        swalHelper.showToast(errorMessage.message, 'warning');
        break;
      default:
        swalHelper.showToast(errorMessage.message, 'error');
        break;
    }

    swalHelper.showToast(errorMessage.message, 'error').then(() => {
      if (redirectStatuses.includes(error.status)) {
        this.redirectToLogin();
      }
    });

    return throwError(() => errorMessage);
  }

  private redirectToLogin(): void {
    // window.location.href = '/sign-in';
    // this.storage.clearAll()
  }
}