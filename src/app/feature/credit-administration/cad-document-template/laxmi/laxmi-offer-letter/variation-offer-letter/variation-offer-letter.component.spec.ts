import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VariationOfferLetterComponent } from './variation-offer-letter.component';

describe('VariationOfferLetterComponent', () => {
  let component: VariationOfferLetterComponent;
  let fixture: ComponentFixture<VariationOfferLetterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VariationOfferLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VariationOfferLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
