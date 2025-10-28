import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DasboardsComponent } from './dasboards.component';

describe('DasboardsComponent', () => {
  let component: DasboardsComponent;
  let fixture: ComponentFixture<DasboardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DasboardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DasboardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
