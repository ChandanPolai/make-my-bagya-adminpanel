import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter'
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
