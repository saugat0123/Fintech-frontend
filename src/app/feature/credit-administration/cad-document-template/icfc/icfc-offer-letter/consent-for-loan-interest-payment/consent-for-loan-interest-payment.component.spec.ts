import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsentForLoanInterestPaymentComponent } from './consent-for-loan-interest-payment.component';

describe('ConsentForLoanInterestPaymentComponent', () => {
  let component: ConsentForLoanInterestPaymentComponent;
  let fixture: ComponentFixture<ConsentForLoanInterestPaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsentForLoanInterestPaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsentForLoanInterestPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
