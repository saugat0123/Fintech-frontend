import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OfferLetterActionComponent } from './offer-letter-action.component';

describe('OfferLetterActionComponent', () => {
  let component: OfferLetterActionComponent;
  let fixture: ComponentFixture<OfferLetterActionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferLetterActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferLetterActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
