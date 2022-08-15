import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferLetterEducationLoanNepaliComponent } from './offer-letter-education-loan-nepali.component';

describe('OfferLetterEducationLoanNepaliComponent', () => {
  let component: OfferLetterEducationLoanNepaliComponent;
  let fixture: ComponentFixture<OfferLetterEducationLoanNepaliComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferLetterEducationLoanNepaliComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferLetterEducationLoanNepaliComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
