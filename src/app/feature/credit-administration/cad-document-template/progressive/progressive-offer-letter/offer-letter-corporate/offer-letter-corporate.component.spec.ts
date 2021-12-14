import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OfferLetterCorporateComponent } from './offer-letter-corporate.component';

describe('OfferLetterCorporateComponent', () => {
  let component: OfferLetterCorporateComponent;
  let fixture: ComponentFixture<OfferLetterCorporateComponent>;

  beforeEach(waitForAsync(() => {
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
