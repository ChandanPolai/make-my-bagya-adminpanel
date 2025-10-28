// interfaces/subcategory.interface.ts

// Interface for the Category object (used in populated categoryId)
export interface Category {
  _id: string;
  name: string;
}

// Interface for a single SubCategory
export interface SubCategory {
  _id?: string;
  name: string;
  description?: string;
  categoryId: Category; // Updated to reflect populated categoryId object
  createdBy: string;    // Ref to Admin
  createdAt?: string;
}

// Interface for a single SubCategory response
export interface SubCategoryResponse {
  message: string;
  data: SubCategory | null;
  status: number;
}

// Interface for paginated SubCategory response
export interface PaginatedSubCategoryResponse {
  message: string;
  data: {
    docs: SubCategory[];
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
  success: boolean; // Added to match the response structure
}