import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OfferLetterHirePurchaseAndAutoLoanComponent } from './offer-letter-hire-purchase-and-auto-loan.component';

describe('OfferLetterHirePurchaseAndAutoLoanComponent', () => {
  let component: OfferLetterHirePurchaseAndAutoLoanComponent;
  let fixture: ComponentFixture<OfferLetterHirePurchaseAndAutoLoanComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferLetterHirePurchaseAndAutoLoanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferLetterHirePurchaseAndAutoLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
