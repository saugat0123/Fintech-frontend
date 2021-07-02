import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcDebitAndLoanDisbursementSampleComponent } from './ac-debit-and-loan-disbursement-sample.component';

describe('AcDebitAndLoanDisbursementSampleComponent', () => {
  let component: AcDebitAndLoanDisbursementSampleComponent;
  let fixture: ComponentFixture<AcDebitAndLoanDisbursementSampleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcDebitAndLoanDisbursementSampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcDebitAndLoanDisbursementSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
