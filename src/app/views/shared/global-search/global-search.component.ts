import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { DebounceDirective } from '../../../core/directives/debounce';

export interface SearchFilter {
  value: string;
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-global-search',
  imports: [CommonModule, FormsModule, NgSelectModule, DebounceDirective],
  templateUrl: './global-search.component.html',
  styleUrl: './global-search.component.scss'
})
export class GlobalSearchComponent implements OnInit {
  searchQuery: string = '';
  selectedFilter: string = 'candidate';

  searchFilters: SearchFilter[] = [
    {
      value: 'onboard',
      label: 'Onboarding',
      route: '/onboarding',
      icon: 'ph-user-plus'
    },
    {
      value: 'vendor',
      label: 'Vendors',
      route: '/vendors',
      icon: 'ph-buildings'
    },
    {
      value: 'candidate',
      label: 'Candidates',
      route: '/candidate',
      icon: 'ph-users'
    },
    {
      value: 'job',
      label: 'Jobs',
      route: '/job/job-details',
      icon: 'ph-briefcase'
    },
    {
      value: 'job-application',
      label: 'Job Applications',
      route: '/job/job-application',
      icon: 'ph-file-text'
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  onSearch(): void {
    if (this.searchQuery.trim()) {
      const selectedFilterData = this.searchFilters.find(f => f.value === this.selectedFilter);
      if (selectedFilterData) {
        // Navigate to the selected component with search query
        this.router.navigate([selectedFilterData.route], {
          queryParams: {
            search: this.searchQuery.trim(),
            globalSearch: 'true'
          }
        });
        // Don't clear search immediately to show what was searched
      }
    }
  }

  onSearchInput(): void {
    // Auto-search on input with debounce
    if (this.searchQuery.trim().length >= 2) {
      this.onSearch();
    }
  }

  getSelectedFilterData(): SearchFilter | undefined {
    return this.searchFilters.find(f => f.value === this.selectedFilter);
  }
}
