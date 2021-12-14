import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OfferLetterPersonalPrintComponent } from './offer-letter-personal-print.component';

describe('OfferLetterPersonalPrintComponent', () => {
  let component: OfferLetterPersonalPrintComponent;
  let fixture: ComponentFixture<OfferLetterPersonalPrintComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferLetterPersonalPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferLetterPersonalPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
