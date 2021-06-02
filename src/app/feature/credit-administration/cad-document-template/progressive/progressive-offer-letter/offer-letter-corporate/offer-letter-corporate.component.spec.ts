import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferLetterCorporateComponent } from './offer-letter-corporate.component';

describe('OfferLetterCorporateComponent', () => {
  let component: OfferLetterCorporateComponent;
  let fixture: ComponentFixture<OfferLetterCorporateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferLetterCorporateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferLetterCorporateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
