import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcDebitAndLoanDisbursementAuthorityPrintComponent } from './ac-debit-and-loan-disbursement-authority-print.component';

describe('AcDebitLoanDisbursementAuthorityPrintComponent', () => {
  let component: AcDebitAndLoanDisbursementAuthorityPrintComponent;
  let fixture: ComponentFixture<AcDebitAndLoanDisbursementAuthorityPrintComponent>;

  beforeEach(async(() => {
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
