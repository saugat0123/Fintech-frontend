import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferLetterBaseComponent } from './offer-letter-base.component';

describe('OfferLetterComponent', () => {
  let component: OfferLetterBaseComponent;
  let fixture: ComponentFixture<OfferLetterBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferLetterBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferLetterBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
