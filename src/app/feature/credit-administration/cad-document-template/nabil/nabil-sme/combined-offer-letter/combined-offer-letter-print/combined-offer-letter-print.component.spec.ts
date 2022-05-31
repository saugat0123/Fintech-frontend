import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CombinedOfferLetterPrintComponent } from './combined-offer-letter-print.component';

describe('CombinedOfferLetterPrintComponent', () => {
  let component: CombinedOfferLetterPrintComponent;
  let fixture: ComponentFixture<CombinedOfferLetterPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CombinedOfferLetterPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CombinedOfferLetterPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
