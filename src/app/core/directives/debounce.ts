import { Directive, ElementRef, EventEmitter, Output, OnDestroy, OnInit, Input, HostListener } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { auditTime, debounceTime, map, filter } from 'rxjs/operators';

@Directive({
  selector: '[debounceTime]',
  standalone:true
})
export class DebounceDirective implements OnInit, OnDestroy {
  @Input() debounceTime = 500; // Default debounce time
  @Input() maxTextLimit = 0; // Default text limit
  @Output() debounceEvent = new EventEmitter<any>();

  private eventSubscription: Subscription | undefined;

  constructor(private elementRef: ElementRef) { }

  ngOnInit() {
    const eventStream = fromEvent(this.elementRef.nativeElement, 'keyup').pipe(
      map((event: any) => ({ value: event.target.value, key: event.key })),
      filter((event: any) => !this.isIgnoredKey(event.key)),
      auditTime(this.debounceTime)
    );
    this.eventSubscription = eventStream.subscribe(inputValue => this.debounceEvent.emit(inputValue));
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }

  private isIgnoredKey(event: string): boolean {
    return ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', ' ', 'Meta', 'Alt', 'Shift', 'Control'].includes(event);
  }

  ngOnDestroy() {
    if (this.eventSubscription) {
      this.eventSubscription.unsubscribe();
    }
  }
}
