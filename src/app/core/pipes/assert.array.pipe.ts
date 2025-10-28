import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'assertArrayType'
})
export class AssertArrayTypePipe implements PipeTransform {
  transform(value: unknown): any[] {
    return value as any[];
  }
}
