import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiManagerService } from '../utilities/api-manager';
import { apiEndpoints } from '../constants/api-endpoint';
import { SubCategory, SubCategoryResponse, PaginatedSubCategoryResponse } from '../../core/interfaces/subcatogrey.interface';

@Injectable({
  providedIn: 'root'
})
export class SubcategoriesService {
  constructor(private apiManager: ApiManagerService) {}

  // Get all subcategories with pagination and optional search
  getAllSubCategories(paginationData: { page: number; limit: number; search?: string }): Observable<PaginatedSubCategoryResponse> {
    return this.apiManager.post(apiEndpoints.LIST_SUBCATEGORIES, paginationData);
  }

  // Get subcategory by ID
  getSubCategoryById(id: string): Observable<SubCategoryResponse> {
    return this.apiManager.post(apiEndpoints.GET_SUBCATEGORY_BY_ID, { id });
  }

  // Create new subcategory
  createSubCategory(data: Partial<SubCategory>): Observable<SubCategoryResponse> {
    return this.apiManager.post(apiEndpoints.CREATE_SUBCATEGORY, data);
  }

  // Update subcategory
updateSubCategory(id: string, data: Partial<SubCategory>): Observable<SubCategoryResponse> {
  return this.apiManager.post(apiEndpoints.UPDATE_SUBCATEGORY, { id, ...data });
}

  // Delete subcategory
  deleteSubCategory(id: string): Observable<SubCategoryResponse> {
    return this.apiManager.post(apiEndpoints.DELETE_SUBCATEGORY, { id });
  }
}