import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferLetterPrintComponent } from './offer-letter-print.component';

describe('OfferLetterPrintComponent', () => {
  let component: OfferLetterPrintComponent;
  let fixture: ComponentFixture<OfferLetterPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferLetterPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferLetterPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
