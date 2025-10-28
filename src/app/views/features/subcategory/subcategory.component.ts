import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { SubcategoriesService } from '../../../core/services/subcatogrey.service';
import { SubCategory, PaginatedSubCategoryResponse } from '../../../core/interfaces/subcatogrey.interface';
import { CategoriesService } from '../../../core/services/catogrey.service';
import { Category } from '../../../core/interfaces/catogrey.interface';
import { swalHelper } from '../../../core/constants/swal-helper';
import { SidebarService } from '../../../core/services/sidebar.service';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-subcategory',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgxPaginationModule,
    FormsModule
  ],
  templateUrl: './subcategory.component.html',
  styleUrls: ['./subcategory.component.scss']
})
export class SubcategoryComponent implements OnInit {
  mode: 'list' | 'create' | 'edit' = 'list';
  subcategories: SubCategory[] = [];
  currentSubcategoryId?: string;
  isLoading: boolean = false;
  isSidebarCollapsed: boolean = false;
  categories: Category[] = [];
  subcategoryForm!: FormGroup;
  payload = {
    page: 1,
    limit: 10,
    search: ''
  };
  totalSubcategories = 0;
  searchTerm: string = '';
  paginationConfig = {
    id: 'subcategories-pagination',
    itemsPerPage: this.payload.limit,
    currentPage: this.payload.page,
    totalItems: 0
  };

  constructor(
    private fb: FormBuilder,
    private subcategoriesService: SubcategoriesService,
    private categoriesService: CategoriesService,
    private sidebarService: SidebarService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadCategories();
    this.loadSubcategories();
    this.sidebarService.isCollapsed$.subscribe((isCollapsed) => {
      this.isSidebarCollapsed = isCollapsed;
    });
  }

  private initializeForm(): void {
    this.subcategoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      categoryId: ['', Validators.required]
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
    this.isLoading = true;
    this.subcategoriesService.getAllSubCategories(this.payload).subscribe({
      next: (response: PaginatedSubCategoryResponse) => {
        this.subcategories = response.data?.docs || [];
        this.totalSubcategories = response.data?.totalDocs || 0;
        this.paginationConfig.totalItems = this.totalSubcategories;
        this.paginationConfig.currentPage = this.payload.page;
        this.paginationConfig.itemsPerPage = this.payload.limit;
        this.isLoading = false;
      },
      error: (err) => {
        swalHelper.messageToast(err?.message ?? 'Failed to load subcategories.', 'error');
        this.isLoading = false;
      }
    });
  }

  onPageChange(page: number): void {
    this.payload.page = page;
    this.paginationConfig.currentPage = page;
    this.loadSubcategories();
  }

  onPageSizeChange(): void {
    this.payload.limit = this.paginationConfig.itemsPerPage;
    this.payload.page = 1;
    this.paginationConfig.currentPage = 1;
    this.loadSubcategories();
  }

  onSearch(): void {
    this.payload.search = this.searchTerm.trim();
    this.payload.page = 1;
    this.paginationConfig.currentPage = 1;
    this.loadSubcategories();
  }

  createNew(): void {
    this.mode = 'create';
    this.subcategoryForm.reset({ categoryId: '' });
    this.currentSubcategoryId = undefined;
  }

  editSubcategory(subcategory: SubCategory): void {
    this.mode = 'edit';
    this.currentSubcategoryId = subcategory._id;
    this.subcategoryForm.patchValue({
      name: subcategory.name,
      description: subcategory.description || '',
      categoryId: subcategory.categoryId?._id
    });
  }

  deleteSubcategory = async (subcategory: SubCategory) => {
    const confirmation = await swalHelper.delete();
    if (confirmation.isConfirmed && subcategory._id) {
      this.subcategoriesService.deleteSubCategory(subcategory._id).subscribe({
        next: (response) => {
          swalHelper.showToast(response.message || 'Subcategory deleted successfully', 'success');
          this.loadSubcategories();
        },
        error: (err) => {
          swalHelper.messageToast(err?.message ?? 'Failed to delete subcategory.', 'error');
        }
      });
    }
  };

  onSubmit(): void {
    if (this.subcategoryForm.valid && !this.isLoading) {
      this.isLoading = true;
      const subcategoryData = this.subcategoryForm.value;
      if (this.mode === 'create') {
        this.subcategoriesService.createSubCategory(subcategoryData).subscribe({
          next: (response) => {
            swalHelper.showToast(response.message || 'Subcategory created successfully', 'success');
            this.isLoading = false;
            this.subcategoryForm.reset({ categoryId: '' });
            this.loadSubcategories();
            this.mode = 'list';
          },
          error: (err) => {
            swalHelper.messageToast(err?.message ?? 'Failed to create subcategory.', 'error');
            this.isLoading = false;
          }
        });
      } else if (this.mode === 'edit' && this.currentSubcategoryId) {
        this.subcategoriesService.updateSubCategory(this.currentSubcategoryId, subcategoryData).subscribe({
          next: (response) => {
            swalHelper.showToast(response.message || 'Subcategory updated successfully', 'success');
            this.isLoading = false;
            this.subcategoryForm.reset({ categoryId: '' });
            this.loadSubcategories();
            this.mode = 'list';
          },
          error: (err) => {
            swalHelper.messageToast(err?.message ?? 'Failed to update subcategory.', 'error');
            this.isLoading = false;
          }
        });
      }
    }
  }

  cancelForm(): void {
    this.subcategoryForm.reset({ categoryId: '' });
    this.mode = 'list';
    this.currentSubcategoryId = undefined;
  }

  formatDate(date: string | null): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.subcategoryForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.subcategoryForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName === 'name' ? 'Subcategory name' : fieldName === 'categoryId' ? 'Category' : 'Field'} is required`;
      if (field.errors['minlength']) return `Minimum 2 characters required`;
    }
    return '';
  }

  exportToExcel(): void {
    Swal.fire({
      title: 'Preparing export...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    
    // Fetch all subcategories for export
    this.subcategoriesService.getAllSubCategories({ page: 1, limit: 10000, search: this.searchTerm }).subscribe({
      next: (response: PaginatedSubCategoryResponse) => {
        const allSubcategories = response.data?.docs || [];
        
        if (allSubcategories.length === 0) {
          Swal.close();
          swalHelper.error('No subcategories to export');
          return;
        }

        try {
          // Prepare data for Excel export
          const excelData = allSubcategories.map((subcategory, index) => ({
            'S.No': index + 1,
            'Subcategory Name': subcategory.name || 'N/A',
            'Category': subcategory.categoryId?.name || 'N/A',
            'Description': subcategory.description || 'N/A',
            'Created Date': this.formatDate(subcategory.createdAt || null)
          }));

          // Create worksheet
          const worksheet = XLSX.utils.json_to_sheet(excelData);
          
          // Create workbook
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Subcategories');

          // Generate filename with current date
          const fileName = `Subcategories_Export_${new Date().toISOString().split('T')[0]}.xlsx`;

          // Write file
          XLSX.writeFile(workbook, fileName);
          
          Swal.close();
          swalHelper.showToast(`Successfully exported ${allSubcategories.length} subcategories to Excel`, 'success');
        } catch (error) {
          Swal.close();
          swalHelper.messageToast('Failed to export subcategories to Excel', 'error');
        }
      },
      error: (err) => {
        Swal.close();
        swalHelper.messageToast(err?.message ?? 'Failed to load subcategories for export', 'error');
      }
    });
  }
}