import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SrdbOfferLetterComponent } from './srdb-offer-letter.component';

describe('SrdbOfferLetterComponent', () => {
  let component: SrdbOfferLetterComponent;
  let fixture: ComponentFixture<SrdbOfferLetterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SrdbOfferLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SrdbOfferLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
