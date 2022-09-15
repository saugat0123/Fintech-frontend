import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferLetterOfAllOtherLoanRetailLoanComponent } from './offer-letter-of-all-other-loan-retail-loan.component';

describe('OfferLetterOfAllOtherLoanRetailLoanComponent', () => {
  let component: OfferLetterOfAllOtherLoanRetailLoanComponent;
  let fixture: ComponentFixture<OfferLetterOfAllOtherLoanRetailLoanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferLetterOfAllOtherLoanRetailLoanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferLetterOfAllOtherLoanRetailLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
