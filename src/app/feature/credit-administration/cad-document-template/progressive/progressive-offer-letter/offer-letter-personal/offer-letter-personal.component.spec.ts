import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferLetterPersonalComponent } from './offer-letter-personal.component';

describe('OfferLetterPersonalComponent', () => {
  let component: OfferLetterPersonalComponent;
  let fixture: ComponentFixture<OfferLetterPersonalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferLetterPersonalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferLetterPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
