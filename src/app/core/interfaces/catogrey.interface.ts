export interface Category {
  _id?: string;
  name: string;
  description?: string;
  createdBy: string; 
  createdAt?: string;
}

export interface CategoryResponse {
  message: string;
  data: Category | Category[] | null;
  status: number;
}

export interface PaginatedCategoryResponse {
  message: string;
  data: {
    docs: Category[];
    totalDocs: number;
    limit: number;
    totalPages: number;
    page: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: number | null;
    nextPage: number | null;
  };
  status: number;
}
