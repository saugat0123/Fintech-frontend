import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OfferLetterHirePurchaseAndAutoLoanPrintComponent } from './offer-letter-hire-purchase-and-auto-loan-print.component';

describe('OfferLetterHirePurchaseAndAutoLoanPrintComponent', () => {
  let component: OfferLetterHirePurchaseAndAutoLoanPrintComponent;
  let fixture: ComponentFixture<OfferLetterHirePurchaseAndAutoLoanPrintComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferLetterHirePurchaseAndAutoLoanPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferLetterHirePurchaseAndAutoLoanPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
