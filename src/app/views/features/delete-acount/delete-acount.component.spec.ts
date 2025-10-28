import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteAcountComponent } from './delete-acount.component';

describe('DeleteAcountComponent', () => {
  let component: DeleteAcountComponent;
  let fixture: ComponentFixture<DeleteAcountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteAcountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteAcountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
