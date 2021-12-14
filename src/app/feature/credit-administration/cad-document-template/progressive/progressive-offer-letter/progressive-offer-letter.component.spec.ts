import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProgressiveOfferLetterComponent } from './progressive-offer-letter.component';

describe('ProgressiveOfferLetterComponent', () => {
  let component: ProgressiveOfferLetterComponent;
  let fixture: ComponentFixture<ProgressiveOfferLetterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgressiveOfferLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressiveOfferLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
