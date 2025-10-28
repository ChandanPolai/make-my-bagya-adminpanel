import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { VideosService } from '../../../core/services/videos.service';
import { Video, PaginatedVideoResponse, VideoPaginationPayload, VideoCreateRequest } from '../../../core/interfaces/videos.interface';
import { CategoriesService } from '../../../core/services/catogrey.service';
import { SubcategoriesService } from '../../../core/services/subcatogrey.service';
import { Category } from '../../../core/interfaces/catogrey.interface';
import { SubCategory } from '../../../core/interfaces/subcatogrey.interface';
import { swalHelper } from '../../../core/constants/swal-helper';
import { SidebarService } from '../../../core/services/sidebar.service';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-videos',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgxPaginationModule,
    FormsModule
  ],
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss']
})
export class VideosComponent implements OnInit, OnDestroy {
  mode: 'list' | 'create' | 'edit' = 'list';
  videos: Video[] = [];
  currentVideo: Video | null = null;
  currentVideoId?: string;
  isLoading: boolean = false;
  isSidebarCollapsed: boolean = false;
  categories: Category[] = [];
  allSubcategories: SubCategory[] = [];
  filteredSubcategories: SubCategory[] = [];

  videoForm!: FormGroup;
  private formSubscription!: Subscription;

  // Tab system
  activeTab: 'all' | 'active' | 'inactive' = 'all';

  // Pagination & Search
  payload: VideoPaginationPayload = {
    page: 1,
    limit: 10,
    search: '',
    isActive: undefined
  };
  totalVideos = 0;
  searchTerm: string = '';

  // Pagination config for ngx-pagination
  paginationConfig = {
    id: 'videos-pagination',
    itemsPerPage: this.payload.limit,
    currentPage: this.payload.page,
    totalItems: 0
  };

  // Access type options
  accessTypeOptions = [
    { value: 'recorded_tutorials', label: 'Recorded Tutorials' },
    { value: 'live_session', label: 'Live Session' },
    // { value: 'choreography', label: 'Choreography' }
  ];

  constructor(
    private fb: FormBuilder,
    private videosService: VideosService,
    private categoriesService: CategoriesService,
    private subcategoriesService: SubcategoriesService,
    private sidebarService: SidebarService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadCategories();
    this.loadSubcategories();
    this.loadVideos();
    this.sidebarService.isCollapsed$.subscribe((isCollapsed) => {
      this.isSidebarCollapsed = isCollapsed;
    });
  }

  ngOnDestroy(): void {
    if (this.formSubscription) {
      this.formSubscription.unsubscribe();
    }
  }

  private initializeForm(): void {
    this.videoForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      url: ['', [Validators.required, Validators.pattern('https?://.+')]],
      categoryId: [''],
      subCategoryId: [''],
      accessType: ['', Validators.required],
      isPremium: [false],
      isActive: [true]
    });

    // Watch category changes to filter subcategories
    this.formSubscription = this.videoForm.get('categoryId')!.valueChanges.subscribe((categoryId) => {
      if (categoryId) {
        this.filteredSubcategories = this.allSubcategories.filter(sub => sub.categoryId?._id === categoryId);
        const currentSubId = this.videoForm.get('subCategoryId')?.value;
        if (currentSubId && !this.filteredSubcategories.some(sub => sub._id === currentSubId)) {
          this.videoForm.patchValue({ subCategoryId: '' });
        }
      } else {
        this.filteredSubcategories = [];
        this.videoForm.patchValue({ subCategoryId: '' });
      }
    });
  }

  loadCategories(): void {
    this.categoriesService.getAllCategories({ page: 1, limit: 1000 }).subscribe({
      next: (response) => {
        this.categories = response.data?.docs || [];
      },
      error: (err) => {
        swalHelper.messageToast('Failed to load categories.', 'error');
      }
    });
  }

  loadSubcategories(): void {
    this.subcategoriesService.getAllSubCategories({ page: 1, limit: 1000 }).subscribe({
      next: (response) => {
        this.allSubcategories = response.data?.docs || [];
      },
      error: (err) => {
        swalHelper.messageToast('Failed to load subcategories.', 'error');
      }
    });
  }

  loadVideos(): void {
    this.isLoading = true;
    this.videosService.getAllVideos(this.payload).subscribe({
      next: (response: PaginatedVideoResponse) => {
        this.videos = response.data?.docs || [];
        this.totalVideos = response.data?.totalDocs || 0;

        // Sync pagination
        this.paginationConfig.totalItems = this.totalVideos;
        this.paginationConfig.currentPage = this.payload.page;
        this.paginationConfig.itemsPerPage = this.payload.limit;

        this.isLoading = false;
      },
      error: (err) => {
        swalHelper.messageToast(err?.message ?? 'Failed to load videos.', 'error');
        this.isLoading = false;
      }
    });
  }

  onPageChange(page: number): void {
    this.payload.page = page;
    this.loadVideos();
  }

  onPageSizeChange(): void {
    this.payload.limit = this.paginationConfig.itemsPerPage;
    this.payload.page = 1;
    this.loadVideos();
  }

  onSearch(): void {
    this.payload.search = this.searchTerm.trim();
    this.payload.page = 1;
    this.loadVideos();
  }

  // Tab switching methods
  switchTab(tab: 'all' | 'active' | 'inactive'): void {
    this.activeTab = tab;
    this.payload.page = 1;
    
    // Set isActive filter based on tab
    switch (tab) {
      case 'all':
        this.payload.isActive = undefined;
        break;
      case 'active':
        this.payload.isActive = true;
        break;
      case 'inactive':
        this.payload.isActive = false;
        break;
    }
    
    this.loadVideos();
  }

  // Toggle methods for form controls
  togglePremium(): void {
    const currentValue = this.videoForm.get('isPremium')?.value;
    this.videoForm.patchValue({ isPremium: !currentValue });
  }

  toggleActive(): void {
    const currentValue = this.videoForm.get('isActive')?.value;
    this.videoForm.patchValue({ isActive: !currentValue });
  }

  createNew(): void {
    this.mode = 'create';
    this.videoForm.reset({ 
      isPremium: false, 
      isActive: true,
      categoryId: '',
      subCategoryId: '',
      accessType: ''
    });
    this.filteredSubcategories = [];
  }

  editVideo(video: Video): void {
    this.mode = 'edit';
    this.currentVideoId = video._id;
    
    // Set filtered subcategories first
    if (video.categoryId?._id) {
      this.filteredSubcategories = this.allSubcategories.filter(sub => sub.categoryId?._id === video.categoryId?._id);
    }
    
    this.videoForm.patchValue({
      title: video.title,
      description: video.description || '',
      url: video.url,
      categoryId: video.categoryId?._id || '',
      subCategoryId: video.subCategoryId?._id || '',
      accessType: video.accessType,
      isPremium: video.isPremium,
      isActive: video.isActive
    });
  }

  deleteVideo = async (video: Video) => {
    const confirmation = await swalHelper.delete();
    if (confirmation.isConfirmed && video._id) {
      this.videosService.deleteVideo(video._id).subscribe({
        next: (response) => {
          swalHelper.showToast(response.message || 'Video deleted successfully', 'success');
          this.loadVideos();
        },
        error: (err) => {
          swalHelper.messageToast(err?.message ?? 'Failed to delete video.', 'error');
        }
      });
    }
  };

  onSubmit(): void {
    if (this.videoForm.valid && !this.isLoading) {
      this.isLoading = true;
      
      const formValue = this.videoForm.value;
      const videoData: VideoCreateRequest = {
        title: formValue.title,
        description: formValue.description,
        url: formValue.url,
        categoryId: formValue.categoryId || undefined,
        subCategoryId: formValue.subCategoryId || undefined,
        accessType: formValue.accessType,
        isPremium: formValue.isPremium,
        isActive: formValue.isActive
      };

      if (this.mode === 'create') {
        this.videosService.createVideo(videoData).subscribe({
          next: (response) => {
            swalHelper.showToast(response.message || 'Video created successfully', 'success');
            this.isLoading = false;
            this.resetForm();
            this.loadVideos();
            this.mode = 'list';
          },
          error: (err) => {
            swalHelper.messageToast(err?.message ?? 'Failed to create video.', 'error');
            this.isLoading = false;
          }
        });
      } else if (this.mode === 'edit' && this.currentVideoId) {
        this.videosService.updateVideo(this.currentVideoId, videoData).subscribe({
          next: (response) => {
            swalHelper.showToast(response.message || 'Video updated successfully', 'success');
            this.isLoading = false;
            this.resetForm();
            this.loadVideos();
            this.mode = 'list';
          },
          error: (err) => {
            swalHelper.messageToast(err?.message ?? 'Failed to update video.', 'error');
            this.isLoading = false;
          }
        });
      }
    }
  }

  cancelForm(): void {
    this.resetForm();
    this.mode = 'list';
    this.currentVideoId = undefined;
  }

  private resetForm(): void {
    this.videoForm.reset({ 
      isPremium: false, 
      isActive: true,
      categoryId: '',
      subCategoryId: '',
      accessType: ''
    });
    this.filteredSubcategories = [];
  }

  formatDate(date: string | Date | null): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.videoForm.get(fieldName);
    return !!(field?.invalid && (field?.dirty || field?.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.videoForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      if (field.errors['minlength']) return `Minimum 2 characters required`;
      if (field.errors['pattern']) return `Invalid URL format`;
    }
    return '';
  }

  getAccessTypeLabel(accessType: string): string {
    const option = this.accessTypeOptions.find(opt => opt.value === accessType);
    return option ? option.label : accessType;
  }

  exportToExcel(): void {
    Swal.fire({
      title: 'Preparing export...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    
    // Fetch all videos for export
    this.videosService.getAllVideos({ page: 1, limit: 10000, search: this.searchTerm, isActive: this.payload.isActive }).subscribe({
      next: (response: PaginatedVideoResponse) => {
        const allVideos = response.data?.docs || [];
        
        if (allVideos.length === 0) {
          Swal.close();
          swalHelper.error('No videos to export');
          return;
        }

        try {
          // Prepare data for Excel export
          const excelData = allVideos.map((video, index) => ({
            'S.No': index + 1,
            'Title': video.title || 'N/A',
            'Description': video.description || 'N/A',
            'URL': video.url || 'N/A',
            'Category': video.categoryId?.name || 'N/A',
            'Subcategory': video.subCategoryId?.name || 'N/A',
            'Access Type': this.getAccessTypeLabel(video.accessType),
            'Premium': video.isPremium ? 'Yes' : 'No',
            'Status': video.isActive ? 'Active' : 'Inactive',
            'Created Date': this.formatDate(video.createdAt || null)
          }));

          // Create worksheet
          const worksheet = XLSX.utils.json_to_sheet(excelData);
          
          // Create workbook
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Videos');

          // Generate filename with current date
          const fileName = `Videos_Export_${new Date().toISOString().split('T')[0]}.xlsx`;

          // Write file
          XLSX.writeFile(workbook, fileName);
          
          Swal.close();
          swalHelper.showToast(`Successfully exported ${allVideos.length} videos to Excel`, 'success');
        } catch (error) {
          Swal.close();
          swalHelper.messageToast('Failed to export videos to Excel', 'error');
        }
      },
      error: (err) => {
        Swal.close();
        swalHelper.messageToast(err?.message ?? 'Failed to load videos for export', 'error');
      }
    });
  }
}