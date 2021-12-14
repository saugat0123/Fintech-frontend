import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OfferLetterApprovedComponent } from './offer-letter-approved.component';

describe('OfferLetterApprovedComponent', () => {
  let component: OfferLetterApprovedComponent;
  let fixture: ComponentFixture<OfferLetterApprovedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferLetterApprovedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferLetterApprovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
