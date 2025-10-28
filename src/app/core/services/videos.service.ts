// core/services/videos.service.ts

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiManagerService } from '../utilities/api-manager';
import { apiEndpoints } from '../constants/api-endpoint';
import { Video, VideoResponse, PaginatedVideoResponse, VideoPaginationPayload, VideoCreateRequest } from '../interfaces/videos.interface';

@Injectable({
  providedIn: 'root'
})
export class VideosService {
  constructor(private apiManager: ApiManagerService) {}

  // Get all videos (paginated + search + isActive filter)
  getAllVideos(paginationData: VideoPaginationPayload): Observable<PaginatedVideoResponse> {
    return this.apiManager.post(apiEndpoints.LIST_VIDEOS, paginationData);
  }

  // Get video by ID
  getVideoById(id: string): Observable<VideoResponse> {
    return this.apiManager.post(apiEndpoints.GET_VIDEO_BY_ID, { id });
  }

  // Create new video
  createVideo(data: VideoCreateRequest): Observable<VideoResponse> {
    return this.apiManager.post(apiEndpoints.CREATE_VIDEO, data);
  }

  // Update video
  updateVideo(id: string, data: Partial<VideoCreateRequest>): Observable<VideoResponse> {
    return this.apiManager.post(apiEndpoints.UPDATE_VIDEO, { id, ...data });
  }

  // Delete video (soft delete - sets isActive to false)
  deleteVideo(id: string): Observable<VideoResponse> {
    return this.apiManager.post(apiEndpoints.DELETE_VIDEO, { id });
  }
}