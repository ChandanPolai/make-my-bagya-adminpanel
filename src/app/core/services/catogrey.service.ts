import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiManagerService } from '../utilities/api-manager';
import { apiEndpoints } from '../constants/api-endpoint';
import { ResponseModel } from '../utilities/response-model';
import { Category, CategoryResponse, PaginatedCategoryResponse } from '../interfaces/catogrey.interface';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  constructor(private apiManager: ApiManagerService) {}

 // Get all categories with pagination + search
getAllCategories(paginationData: { page: number; limit: number; search?: string }): Observable<PaginatedCategoryResponse> {
  return this.apiManager.post(apiEndpoints.LIST_CATEGORIES, paginationData);
}


  // Get category by ID
  getCategoryById(id: string): Observable<CategoryResponse> {
    return this.apiManager.post(apiEndpoints.GET_CATEGORY_BY_ID, { id });
  }

  // Create new category
  createCategory(data: Partial<Category>): Observable<ResponseModel> {
    return this.apiManager.post(apiEndpoints.CREATE_CATEGORY, data);
  }

  // Update category
updateCategory(id: string, data: Partial<Category>): Observable<CategoryResponse> {
  return this.apiManager.post(apiEndpoints.UPDATE_CATEGORY, { id, ...data });
}

  // Delete category
  deleteCategory(id: string): Observable<CategoryResponse> {
    return this.apiManager.post(apiEndpoints.DELETE_CATEGORY, { id });
  }
}
