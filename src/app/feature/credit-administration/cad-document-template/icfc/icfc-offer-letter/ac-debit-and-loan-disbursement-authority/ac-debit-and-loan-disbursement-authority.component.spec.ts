import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcDebitAndLoanDisbursementAuthorityComponent } from './ac-debit-and-loan-disbursement-authority.component';

describe('AcDebitAndLoanDisbursementAuthorityComponent', () => {
  let component: AcDebitAndLoanDisbursementAuthorityComponent;
  let fixture: ComponentFixture<AcDebitAndLoanDisbursementAuthorityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcDebitAndLoanDisbursementAuthorityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcDebitAndLoanDisbursementAuthorityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
