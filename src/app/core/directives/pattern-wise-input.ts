import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[inputPattern]',
})
export class ValidatePatternDirective {
  private regex: RegExp = new RegExp('^(\d\d\\+\d\d,)*(\d\d\\+\d\d,?)?$');

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event'])
  onInputChange(event: any) {
    const value = this.el.nativeElement.value;

    const segments = value.split(',');
    if (segments.length > 2) {
      event.target.value = value.slice(0, -1);
      return;
    }

    if (/\s/.test(value)) {
      event.preventDefault();
      event.target.value = value.replace(/\s+/g, '');
      return;
    }


    for (let segment of segments) {
      if (!this.isValidSegment(segment)) {
        event.target.value = value.slice(0, -1);
        return;
      }
    }
  }

  isValidSegment(segment: string): boolean {
    const pattern = /^(?:(\d+)(\+)?(\d*)?)?$/;
    return pattern.test(segment);
  }
}
