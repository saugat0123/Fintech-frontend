import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LoanDeedPersonalLoanHomeLoanIcfcPrintComponent } from './loan-deed-personal-loan-home-loan-icfc-print.component';

describe('LoanDeedPersonalLoanHomeLoanIcfcPrintComponent', () => {
  let component: LoanDeedPersonalLoanHomeLoanIcfcPrintComponent;
  let fixture: ComponentFixture<LoanDeedPersonalLoanHomeLoanIcfcPrintComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanDeedPersonalLoanHomeLoanIcfcPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanDeedPersonalLoanHomeLoanIcfcPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
