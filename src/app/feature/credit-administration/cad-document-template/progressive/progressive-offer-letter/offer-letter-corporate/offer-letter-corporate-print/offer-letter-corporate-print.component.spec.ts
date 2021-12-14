import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OfferLetterCorporatePrintComponent } from './offer-letter-corporate-print.component';

describe('OfferLetterCorporatePrintComponent', () => {
  let component: OfferLetterCorporatePrintComponent;
  let fixture: ComponentFixture<OfferLetterCorporatePrintComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferLetterCorporatePrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferLetterCorporatePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
