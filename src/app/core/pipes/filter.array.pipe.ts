// pipes/filter.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: true
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], field: string, value: any): any[] {
    if (!items) return [];
    if (!field || value === undefined || value === null || value === '') return items;

    return items.filter(item => {
      // Handle nested properties like 'companyId.companyName'
      const fieldValue = this.getNestedProperty(item, field);
      
      if (fieldValue === undefined || fieldValue === null) return false;
      
      // Convert both values to strings for comparison
      const itemValue = String(fieldValue).toLowerCase();
      const searchValue = String(value).toLowerCase();
      
      return itemValue === searchValue;
    });
  }

  private getNestedProperty(obj: any, path: string): any {
    return path.split('.').reduce((current, prop) => {
      return current && current[prop] !== undefined ? current[prop] : undefined;
    }, obj);
  }
}

// Additional search filter pipe for multiple field search
@Pipe({
  name: 'searchFilter',
  standalone: true
})
export class SearchFilterPipe implements PipeTransform {
  transform(items: any[], searchText: string, fieldPaths: string[]): any[] {
    if (!items) return [];
    if (!searchText) return items;

    searchText = searchText.toLowerCase();

    return items.filter(item => {
      return fieldPaths.some(fieldPath => {
        const fields = fieldPath.split('.');
        let valueToCheck = item;

        for (let field of fields) {
          if (valueToCheck && valueToCheck.hasOwnProperty(field)) {
            valueToCheck = valueToCheck[field];
          } else {
            return false;
          }
        }

        if (typeof valueToCheck !== 'string') {
          valueToCheck = String(valueToCheck);
        }

        return valueToCheck.toLowerCase().includes(searchText);
      });
    });
  }
}

// Count pipe for counting items that match a condition
@Pipe({
  name: 'countBy',
  standalone: true
})
export class CountByPipe implements PipeTransform {
  transform(items: any[], field: string, value: any): number {
    if (!items || !field) return 0;
    
    return items.filter(item => {
      const fieldValue = this.getNestedProperty(item, field);
      return fieldValue === value;
    }).length;
  }

  private getNestedProperty(obj: any, path: string): any {
    return path.split('.').reduce((current, prop) => {
      return current && current[prop] !== undefined ? current[prop] : undefined;
    }, obj);
  }
}