import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-scroll-table-wrapper',
  imports: [NgxPaginationModule,CommonModule,FormsModule],
  templateUrl: './scroll-table-wrapper.component.html',
  styleUrl: './scroll-table-wrapper.component.scss'
})
export class ScrollTableWrapperComponent {
  @ViewChild('tableScroll') tableScroll!: ElementRef<HTMLDivElement>;

  @Input() currentTheme!: any;

  @Output() pageChange = new EventEmitter<number>();

  showShadow = false;

  ngAfterViewInit(): void {
    this.tableScroll.nativeElement.addEventListener('scroll', () => {
      this.showShadow = this.tableScroll.nativeElement.scrollTop > 0;
    });
  }

  getTableHeight(): string {
    const windowHeight = window.innerHeight;
    const header = 120;
    const footer = 80;
    const padding = 100;
    const available = windowHeight - header - footer - padding;
    const height = Math.max(400, Math.min(available, 800));
    return `${height}px`;
  }

  onPageChange(page: number) {
    this.pageChange.emit(page);
  }
}
