import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferLetterConsentComponent } from './offer-letter-consent.component';

describe('OfferLetterConsentComponent', () => {
  let component: OfferLetterConsentComponent;
  let fixture: ComponentFixture<OfferLetterConsentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferLetterConsentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferLetterConsentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
