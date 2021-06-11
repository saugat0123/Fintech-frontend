import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferLetterPersonalPrintComponent } from './offer-letter-personal-print.component';

describe('OfferLetterPersonalPrintComponent', () => {
  let component: OfferLetterPersonalPrintComponent;
  let fixture: ComponentFixture<OfferLetterPersonalPrintComponent>;

  beforeEach(async(() => {
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
