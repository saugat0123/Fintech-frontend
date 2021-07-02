import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcDebitAndLoanDisbursementSamplePrintComponent } from './ac-debit-and-loan-disbursement-sample-print.component';

describe('AcDebitAndLoanDisbursementSamplePrintComponent', () => {
  let component: AcDebitAndLoanDisbursementSamplePrintComponent;
  let fixture: ComponentFixture<AcDebitAndLoanDisbursementSamplePrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcDebitAndLoanDisbursementSamplePrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcDebitAndLoanDisbursementSamplePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
