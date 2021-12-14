import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MegaOfferLetterComponent } from './mega-offer-letter.component';

describe('MegaOfferLetterComponent', () => {
  let component: MegaOfferLetterComponent;
  let fixture: ComponentFixture<MegaOfferLetterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MegaOfferLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MegaOfferLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
