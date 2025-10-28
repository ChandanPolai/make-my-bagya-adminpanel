import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { ServicesService } from '../../../core/services/services.service';
import { Service, PaginatedServiceResponse } from '../../../core/interfaces/services.interface';
import { swalHelper } from '../../../core/constants/swal-helper';
import { SidebarService } from '../../../core/services/sidebar.service';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgxPaginationModule,
    FormsModule
  ],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {
  mode: 'list' | 'create' | 'edit' | 'view' = 'list';
  services: Service[] = [];
  currentService: Service | null = null;
  currentServiceId?: string;
  isLoading: boolean = false;
  isSidebarCollapsed: boolean = false;

  serviceForm!: FormGroup;

  // Pagination & Search
  payload = {
    page: 1,
    limit: 10,
    search: ''
  };
  totalServices = 0;
  searchTerm: string = '';

  // Pagination config for ngx-pagination
  paginationConfig = {
    id: 'services-pagination',
    itemsPerPage: this.payload.limit,
    currentPage: this.payload.page,
    totalItems: 0
  };

  // ALL period options with type restrictions
  allPeriodOptions = [
    { value: 'monthly', label: 'Monthly', forTypes: ['recorded_tutorials', 'live_session'] },
    { value: 'annually', label: 'Annually', forTypes: ['recorded_tutorials', 'live_session'] },
    { value: 'lifetime access', label: 'Lifetime Access', forTypes: ['recorded_tutorials', 'live_session'] },
    { value: '3 months plan', label: '3 Months Plan', forTypes: ['recorded_tutorials', 'live_session'] },
    { value: '6 months plan', label: '6 Months Plan', forTypes: ['recorded_tutorials', 'live_session'] },
    { value: 'annual plan', label: 'Annual Plan', forTypes: ['recorded_tutorials', 'live_session'] },
    { value: 'trial class', label: 'Trial Class', forTypes: ['live_session'] },
    { value: 'masterclass', label: 'Masterclass', forTypes: ['live_session'] }
  ];

  // Dynamic period options - filtered based on accessType
  periodOptions: { value: string; label: string }[] = [];

  // Access type options
  accessTypeOptions = [
    { value: 'recorded_tutorials', label: 'Recorded Tutorials'},
    { value: 'live_session', label: 'Live Session' }
  ];

  constructor(
    private fb: FormBuilder,
    private servicesService: ServicesService,
    private sidebarService: SidebarService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadServices();
    this.sidebarService.isCollapsed$.subscribe((isCollapsed) => {
      this.isSidebarCollapsed = isCollapsed;
    });
  }

  private initializeForm(): void {
    this.serviceForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      batch_time: [''],
      accessType: ['', Validators.required],
      tax: this.fb.group({
        gst: [0, [Validators.min(0), Validators.max(100)]],
        sgst: [0, [Validators.min(0), Validators.max(100)]]
      }),
      pricingOptions: this.fb.array([])
    });

    // Listen to accessType changes to update period options dynamically
    this.serviceForm.get('accessType')?.valueChanges.subscribe(accessType => {
      this.updatePeriodOptions(accessType);
    });

    // Add initial pricing option
    this.addPricingOption();
  }

  // Update period dropdown options based on selected accessType
  updatePeriodOptions(accessType: string): void {
    if (accessType === 'recorded_tutorials') {
      // Only periods allowed for recorded_tutorials
      this.periodOptions = this.allPeriodOptions
        .filter(opt => opt.forTypes.includes('recorded_tutorials'))
        .map(opt => ({ value: opt.value, label: opt.label }));
    } else if (accessType === 'live_session') {
      // All periods including trial class and masterclass
      this.periodOptions = this.allPeriodOptions
        .filter(opt => opt.forTypes.includes('live_session'))
        .map(opt => ({ value: opt.value, label: opt.label }));
    } else {
      // Default - show all
      this.periodOptions = this.allPeriodOptions.map(opt => ({ value: opt.value, label: opt.label }));
    }

    // Clear invalid periods from existing pricing options
    this.pricingOptions.controls.forEach((control) => {
      const periodValue = control.get('period')?.value;
      const isValidPeriod = this.periodOptions.some(opt => opt.value === periodValue);
      
      if (periodValue && !isValidPeriod) {
        control.get('period')?.setValue('');
      }
    });
  }

  get pricingOptions(): FormArray {
    return this.serviceForm.get('pricingOptions') as FormArray;
  }

  createPricingOptionGroup(): FormGroup {
    return this.fb.group({
      period: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      description: [''],  // New field for period-specific description
      active: [true]  // NEW - checkbox for hide/show pricing option
    });
  }

  addPricingOption(): void {
    this.pricingOptions.push(this.createPricingOptionGroup());
  }

  removePricingOption(index: number): void {
    if (this.pricingOptions.length > 1) {
      this.pricingOptions.removeAt(index);
    }
  }

  loadServices(): void {
    this.isLoading = true;
    this.servicesService.getAllServices(this.payload).subscribe({
      next: (response: PaginatedServiceResponse) => {
        this.services = response.data?.docs || [];
        this.totalServices = response.data?.totalDocs || 0;

        // Sync pagination
        this.paginationConfig.totalItems = this.totalServices;
        this.paginationConfig.currentPage = this.payload.page;
        this.paginationConfig.itemsPerPage = this.payload.limit;

        this.isLoading = false;
      },
      error: (err) => {
        swalHelper.messageToast(err?.message ?? 'Failed to load services.', 'error');
        this.isLoading = false;
      }
    });
  }

  onPageChange(page: number): void {
    this.payload.page = page;
    this.loadServices();
  }

  onPageSizeChange(): void {
    this.payload.limit = this.paginationConfig.itemsPerPage;
    this.payload.page = 1;
    this.loadServices();
  }

  onSearch(): void {
    this.payload.search = this.searchTerm.trim();
    this.payload.page = 1;
    this.loadServices();
  }

  createNew(): void {
    this.mode = 'create';
    this.serviceForm.reset();
    
    // Clear pricing options and add one fresh option
    while (this.pricingOptions.length > 0) {
      this.pricingOptions.removeAt(0);
    }
    this.addPricingOption();

    // Set default tax values to 0
    this.serviceForm.patchValue({
      tax: { gst: 0, sgst: 0 }
    });

    // Reset period options until accessType is selected
    this.periodOptions = [];
  }

  viewService(service: Service): void {
    this.mode = 'view';
    this.currentService = service;
  }

  editService(service: Service): void {
    this.mode = 'edit';
    this.currentServiceId = service._id;
    
    // First set accessType to update period options
    this.serviceForm.patchValue({
      name: service.name,
      description: service.description || '',
      batch_time: service.batch_time || '',
      accessType: service.accessType || '',
      tax: {
        gst: service.tax?.gst || 0,
        sgst: service.tax?.sgst || 0
      }
    });

    // Update period options based on accessType
    this.updatePeriodOptions(service.accessType || '');
    
    // Clear existing pricing options
    while (this.pricingOptions.length > 0) {
      this.pricingOptions.removeAt(0);
    }

    // Add pricing options from service
    if (service.pricingOptions && service.pricingOptions.length > 0) {
      service.pricingOptions.forEach(option => {
        const pricingGroup = this.createPricingOptionGroup();
        pricingGroup.patchValue({
          period: option.period,
          price: option.price,
          description: option.description || '',
          active: option.active !== undefined ? option.active : true  // Default to true if not provided
        });
        this.pricingOptions.push(pricingGroup);
      });
    } else {
      this.addPricingOption();
    }
  }

  deleteService = async (service: Service) => {
    const confirmation = await swalHelper.delete();
    if (confirmation.isConfirmed && service._id) {
      this.servicesService.deleteService(service._id).subscribe({
        next: (response) => {
          swalHelper.showToast(response.message || 'Service deleted successfully', 'success');
          this.loadServices();
        },
        error: (err) => {
          swalHelper.messageToast(err?.message ?? 'Failed to delete service.', 'error');
        }
      });
    }
  };

  onSubmit(): void {
    if (this.serviceForm.valid && !this.isLoading) {
      this.isLoading = true;
      
      const formValue = this.serviceForm.value;
      const serviceData = {
        name: formValue.name,
        description: formValue.description,
        batch_time: formValue.batch_time,
        accessType: formValue.accessType,
        tax: formValue.tax,
        pricingOptions: formValue.pricingOptions
      };

      if (this.mode === 'create') {
        this.servicesService.createService(serviceData).subscribe({
          next: (response) => {
            swalHelper.showToast(response.message || 'Service created successfully', 'success');
            this.isLoading = false;
            this.resetForm();
            this.loadServices();
            this.mode = 'list';
          },
          error: (err) => {
            swalHelper.messageToast(err?.message ?? 'Failed to create service.', 'error');
            this.isLoading = false;
          }
        });
      } else if (this.mode === 'edit' && this.currentServiceId) {
        this.servicesService.updateService(this.currentServiceId, serviceData).subscribe({
          next: (response) => {
            swalHelper.showToast(response.message || 'Service updated successfully', 'success');
            this.isLoading = false;
            this.resetForm();
            this.loadServices();
            this.mode = 'list';
          },
          error: (err) => {
            swalHelper.messageToast(err?.message ?? 'Failed to update service.', 'error');
            this.isLoading = false;
          }
        });
      }
    }
  }

  cancelForm(): void {
    this.resetForm();
    this.mode = 'list';
    this.currentServiceId = undefined;
    this.currentService = null;
  }

  private resetForm(): void {
    this.serviceForm.reset();
    while (this.pricingOptions.length > 0) {
      this.pricingOptions.removeAt(0);
    }
    this.addPricingOption();
    this.serviceForm.patchValue({
      tax: { gst: 0, sgst: 0 }
    });
    this.periodOptions = [];
  }

  formatDate(date: string | Date | null): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount);
  }

  calculateTotalTax(service: Service): number {
    return (service.tax?.gst || 0) + (service.tax?.sgst || 0);
  }

  calculatePriceWithTax(price: number, service: Service): number {
    const totalTaxPercent = this.calculateTotalTax(service);
    const taxAmount = (price * totalTaxPercent) / 100;
    return price + taxAmount;
  }

  getMinPrice(service: Service): number {
    if (!service.pricingOptions || service.pricingOptions.length === 0) return 0;
    return Math.min(...service.pricingOptions.map(option => option.price));
  }

  getMaxPrice(service: Service): number {
    if (!service.pricingOptions || service.pricingOptions.length === 0) return 0;
    return Math.max(...service.pricingOptions.map(option => option.price));
  }

  getPriceRange(service: Service): string {
    const minPrice = this.getMinPrice(service);
    const maxPrice = this.getMaxPrice(service);
    
    if (minPrice === maxPrice) {
      return this.formatCurrency(minPrice);
    }
    return `${this.formatCurrency(minPrice)} - ${this.formatCurrency(maxPrice)}`;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.serviceForm.get(fieldName);
    return !!(field?.invalid && (field?.dirty || field?.touched));
  }

  isPricingFieldInvalid(index: number, fieldName: string): boolean {
    const field = this.pricingOptions.at(index).get(fieldName);
    return !!(field?.invalid && (field?.dirty || field?.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.serviceForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      if (field.errors['minlength']) return `Minimum 2 characters required`;
      if (field.errors['min']) return `Value must be greater than or equal to ${field.errors['min'].min}`;
      if (field.errors['max']) return `Value must be less than or equal to ${field.errors['max'].max}`;
    }
    return '';
  }

  getAccessTypeLabel(accessType: string): string {
    const option = this.accessTypeOptions.find(opt => opt.value === accessType);
    return option ? option.label : accessType;
  }

  getPeriodLabel(period: string): string {
    const option = this.allPeriodOptions.find(opt => opt.value === period);
    return option ? option.label : period;
  }

  exportToExcel(): void {
    Swal.fire({
      title: 'Preparing export...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
    
    // Fetch all services for export
    this.servicesService.getAllServices({ page: 1, limit: 10000, search: this.searchTerm }).subscribe({
      next: (response: PaginatedServiceResponse) => {
        const allServices = response.data?.docs || [];
        
        if (allServices.length === 0) {
          Swal.close();
          swalHelper.error('No services to export');
          return;
        }

        try {
          // Prepare data for Excel export
          const excelData = allServices.map((service, index) => ({
            'S.No': index + 1,
            'Service Name': service.name || 'N/A',
            'Description': service.description || 'N/A',
            'Access Type': this.getAccessTypeLabel(service.accessType),
            'Batch Time': service.batch_time || 'N/A',
            'GST': service.tax?.gst || 0,
            'SGST': service.tax?.sgst || 0,
            'Total Tax': this.calculateTotalTax(service),
            'Min Price': this.getMinPrice(service),
            'Max Price': this.getMaxPrice(service),
            'Price Range': this.getPriceRange(service),
            'Created Date': this.formatDate(service.createdAt || null)
          }));

          // Create worksheet
          const worksheet = XLSX.utils.json_to_sheet(excelData);
          
          // Create workbook
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Services');

          // Generate filename with current date
          const fileName = `Services_Export_${new Date().toISOString().split('T')[0]}.xlsx`;

          // Write file
          XLSX.writeFile(workbook, fileName);
          
          Swal.close();
          swalHelper.showToast(`Successfully exported ${allServices.length} services to Excel`, 'success');
        } catch (error) {
          Swal.close();
          swalHelper.messageToast('Failed to export services to Excel', 'error');
        }
      },
      error: (err) => {
        Swal.close();
        swalHelper.messageToast(err?.message ?? 'Failed to load services for export', 'error');
      }
    });
  }
}