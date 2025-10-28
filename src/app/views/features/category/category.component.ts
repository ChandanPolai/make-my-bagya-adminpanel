import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { CategoriesService } from '../../../core/services/catogrey.service';
import { Category, PaginatedCategoryResponse } from '../../../core/interfaces/catogrey.interface';
import { swalHelper } from '../../../core/constants/swal-helper';
import { SidebarService } from '../../../core/services/sidebar.service';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgxPaginationModule,
    FormsModule
  ],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent implements OnInit {
  mode: 'list' | 'create' | 'edit' = 'list';
  categories: Category[] = [];
  currentCategoryId?: string;
  isLoading: boolean = false;
  isSidebarCollapsed: boolean = false;
  categoryForm!: FormGroup;
  payload = {
    page: 1,
    limit: 10,
    search: ''
  };
  totalCategories = 0;
  searchTerm: string = '';
  paginationConfig = {
    id: 'categories-pagination',
    itemsPerPage: this.payload.limit,
    currentPage: this.payload.page,
    totalItems: 0
  };

  constructor(
    private fb: FormBuilder,
    private categoriesService: CategoriesService,
    private sidebarService: SidebarService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadCategories();
    this.sidebarService.isCollapsed$.subscribe((isCollapsed) => {
      this.isSidebarCollapsed = isCollapsed;
    });
  }

  private initializeForm(): void {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: ['']
    });
  }

  loadCategories(): void {
    this.isLoading = true;
    this.categoriesService.getAllCategories(this.payload).subscribe({
      next: (response: PaginatedCategoryResponse) => {
        this.categories = response.data?.docs || [];
        this.totalCategories = response.data?.totalDocs || 0;
        this.paginationConfig.totalItems = this.totalCategories;
        this.paginationConfig.currentPage = this.payload.page;
        this.paginationConfig.itemsPerPage = this.payload.limit;
        this.isLoading = false;
      },
      error: (err) => {
        swalHelper.messageToast(err?.message ?? 'Failed to load categories.', 'error');
        this.isLoading = false;
      }
    });
  }

  onPageChange(page: number): void {
    this.payload.page = page;
    this.paginationConfig.currentPage = page;
    this.loadCategories();
  }

  onPageSizeChange(): void {
    this.payload.limit = this.paginationConfig.itemsPerPage;
    this.payload.page = 1;
    this.paginationConfig.currentPage = 1;
    this.loadCategories();
  }

  onSearch(): void {
    this.payload.search = this.searchTerm.trim();
    this.payload.page = 1;
    this.paginationConfig.currentPage = 1;
    this.loadCategories();
  }

  createNew(): void {
    this.mode = 'create';
    this.categoryForm.reset();
    this.currentCategoryId = undefined;
  }

  editCategory(category: Category): void {
    this.mode = 'edit';
    this.currentCategoryId = category._id;
    this.categoryForm.patchValue({
      name: category.name,
      description: category.description || ''
    });
  }

  deleteCategory = async (category: Category) => {
    const confirmation = await swalHelper.delete();
    if (confirmation.isConfirmed && category._id) {
      this.categoriesService.deleteCategory(category._id).subscribe({
        next: (response) => {
          swalHelper.showToast(response.message || 'Category deleted successfully', 'success');
          this.loadCategories();
        },
        error: (err) => {
          swalHelper.messageToast(err?.message ?? 'Failed to delete category.', 'error');
        }
      });
    }
  };

  onSubmit(): void {
    if (this.categoryForm.valid && !this.isLoading) {
      this.isLoading = true;
      const categoryData = this.categoryForm.value;
      if (this.mode === 'create') {
        this.categoriesService.createCategory(categoryData).subscribe({
          next: (response) => {
            swalHelper.showToast(response.message || 'Category created successfully', 'success');
            this.isLoading = false;
            this.categoryForm.reset();
            this.loadCategories();
            this.mode = 'list';
          },
          error: (err) => {
            swalHelper.messageToast(err?.message ?? 'Failed to create category.', 'error');
            this.isLoading = false;
          }
        });
      } else if (this.mode === 'edit' && this.currentCategoryId) {
        this.categoriesService.updateCategory(this.currentCategoryId, categoryData).subscribe({
          next: (response) => {
            swalHelper.showToast(response.message || 'Category updated successfully', 'success');
            this.isLoading = false;
            this.categoryForm.reset();
            this.loadCategories();
            this.mode = 'list';
          },
          error: (err) => {
            swalHelper.messageToast(err?.message ?? 'Failed to update category.', 'error');
            this.isLoading = false;
          }
        });
      }
    }
  }

  cancelForm(): void {
    this.categoryForm.reset();
    this.mode = 'list';
    this.currentCategoryId = undefined;
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
    const field = this.categoryForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.categoryForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName === 'name' ? 'Category name' : 'Field'} is required`;
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
    
    // Fetch all categories for export
    this.categoriesService.getAllCategories({ page: 1, limit: 10000, search: this.searchTerm }).subscribe({
      next: (response: PaginatedCategoryResponse) => {
        const allCategories = response.data?.docs || [];
        
        if (allCategories.length === 0) {
          Swal.close();
          swalHelper.error('No categories to export');
          return;
        }

        try {
          // Prepare data for Excel export
          const excelData = allCategories.map((category, index) => ({
            'S.No': index + 1,
            'Category Name': category.name || 'N/A',
            'Description': category.description || 'N/A',
            'Created Date': this.formatDate(category.createdAt || null)
          }));

          // Create worksheet
          const worksheet = XLSX.utils.json_to_sheet(excelData);
          
          // Create workbook
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Categories');

          // Generate filename with current date
          const fileName = `Categories_Export_${new Date().toISOString().split('T')[0]}.xlsx`;

          // Write file
          XLSX.writeFile(workbook, fileName);
          
          Swal.close();
          swalHelper.showToast(`Successfully exported ${allCategories.length} categories to Excel`, 'success');
        } catch (error) {
          Swal.close();
          swalHelper.messageToast('Failed to export categories to Excel', 'error');
        }
      },
      error: (err) => {
        Swal.close();
        swalHelper.messageToast(err?.message ?? 'Failed to load categories for export', 'error');
      }
    });
  }
}