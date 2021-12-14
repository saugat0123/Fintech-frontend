import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LoanActionVerificationComponent } from './loan-action-verification.component';

describe('LoanActionVerificationComponent', () => {
  let component: LoanActionVerificationComponent;
  let fixture: ComponentFixture<LoanActionVerificationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanActionVerificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanActionVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
