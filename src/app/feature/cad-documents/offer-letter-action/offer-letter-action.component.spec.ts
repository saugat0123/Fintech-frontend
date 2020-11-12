import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferLetterActionComponent } from './offer-letter-action.component';

describe('OfferLetterActionComponent', () => {
  let component: OfferLetterActionComponent;
  let fixture: ComponentFixture<OfferLetterActionComponent>;

  beforeEach(async(() => {
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
