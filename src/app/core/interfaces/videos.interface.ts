// core/interfaces/videos.interface.ts

// Interface for Category (populated in video)
export interface Category {
  _id: string;
  name: string;
}

// Interface for SubCategory (populated in video)
export interface SubCategory {
  _id: string;
  name: string;
  categoryId?: Category;
}

// Interface for Admin (populated in video)
export interface Admin {
  _id: string;
  name: string;
  email: string;
}

// Interface for a single Video
export interface Video {
  _id?: string;
  title: string;
  description?: string;
  url: string;
  categoryId?: Category | null;
  subCategoryId?: SubCategory | null;
  accessType: 'recorded_tutorials' | 'live_session' | 'choreography';
  isPremium: boolean;
  isActive: boolean;
  uploadedBy?: Admin;
  createdAt?: string | Date;
}

// Interface for pagination payload
export interface VideoPaginationPayload {
  page: number;
  limit: number;
  search?: string;
  isActive?: boolean;
}

// Interface for single video response
export interface VideoResponse {
  success: boolean;
  message: string;
  data?: Video;
  error?: string;
}

// Interface for paginated video response
export interface PaginatedVideoResponse {
  success: boolean;
  message: string;
  data?: {
    docs: Video[];
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
  error?: string;
}

// Interface for video create/update request
export interface VideoCreateRequest {
  title: string;
  description?: string;
  url: string;
  categoryId?: string;
  subCategoryId?: string;
  accessType: 'recorded_tutorials' | 'live_session' | 'choreography';
  isPremium: boolean;
  isActive: boolean;
}

export interface VideoUpdateRequest extends Partial<VideoCreateRequest> {
  id: string;
}