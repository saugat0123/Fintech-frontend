import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LoanDeedPersonalLoanHomeLoanIcfcComponent } from './loan-deed-personal-loan-home-loan-icfc.component';

describe('LoanDeedPersonalLoanHomeLoanIcfcComponent', () => {
  let component: LoanDeedPersonalLoanHomeLoanIcfcComponent;
  let fixture: ComponentFixture<LoanDeedPersonalLoanHomeLoanIcfcComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanDeedPersonalLoanHomeLoanIcfcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanDeedPersonalLoanHomeLoanIcfcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
