import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AcDebitAndLoanDisbursementAuthorityPrintComponent } from './ac-debit-and-loan-disbursement-authority-print.component';

describe('AcDebitLoanDisbursementAuthorityPrintComponent', () => {
  let component: AcDebitAndLoanDisbursementAuthorityPrintComponent;
  let fixture: ComponentFixture<AcDebitAndLoanDisbursementAuthorityPrintComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AcDebitAndLoanDisbursementAuthorityPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcDebitAndLoanDisbursementAuthorityPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
