import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrollTableWrapperComponent } from './scroll-table-wrapper.component';

describe('ScrollTableWrapperComponent', () => {
  let component: ScrollTableWrapperComponent;
  let fixture: ComponentFixture<ScrollTableWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScrollTableWrapperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrollTableWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
