import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Section1CustomerOfferLetterTypeComponent } from './section1-customer-offer-letter-type.component';

describe('Section1CustomerOfferLetterTypeComponent', () => {
  let component: Section1CustomerOfferLetterTypeComponent;
  let fixture: ComponentFixture<Section1CustomerOfferLetterTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Section1CustomerOfferLetterTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Section1CustomerOfferLetterTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
