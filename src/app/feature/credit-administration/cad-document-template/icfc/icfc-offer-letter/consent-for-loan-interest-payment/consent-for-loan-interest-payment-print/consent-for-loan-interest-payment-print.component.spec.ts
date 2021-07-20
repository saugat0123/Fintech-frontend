import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsentForLoanInterestPaymentPrintComponent } from './consent-for-loan-interest-payment-print.component';

describe('ConsentForLoanInterestPaymentPrintComponent', () => {
  let component: ConsentForLoanInterestPaymentPrintComponent;
  let fixture: ComponentFixture<ConsentForLoanInterestPaymentPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsentForLoanInterestPaymentPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsentForLoanInterestPaymentPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
