import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LoanActionModalComponent } from './loan-action-modal.component';

describe('LoanActionModalComponent', () => {
  let component: LoanActionModalComponent;
  let fixture: ComponentFixture<LoanActionModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanActionModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanActionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
