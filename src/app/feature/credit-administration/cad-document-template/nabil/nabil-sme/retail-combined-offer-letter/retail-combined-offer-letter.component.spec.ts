import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailCombinedOfferLetterComponent } from './retail-combined-offer-letter.component';

describe('RetailCombinedOfferLetterComponent', () => {
  let component: RetailCombinedOfferLetterComponent;
  let fixture: ComponentFixture<RetailCombinedOfferLetterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetailCombinedOfferLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailCombinedOfferLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
