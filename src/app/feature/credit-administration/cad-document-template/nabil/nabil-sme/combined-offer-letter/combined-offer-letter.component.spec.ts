import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CombinedOfferLetterComponent } from './combined-offer-letter.component';

describe('CombinedOfferLetterComponent', () => {
  let component: CombinedOfferLetterComponent;
  let fixture: ComponentFixture<CombinedOfferLetterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CombinedOfferLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CombinedOfferLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
