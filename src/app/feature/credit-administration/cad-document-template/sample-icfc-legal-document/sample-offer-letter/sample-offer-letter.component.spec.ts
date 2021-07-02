import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SampleOfferLetterComponent } from './sample-offer-letter.component';

describe('SampleOfferLetterComponent', () => {
  let component: SampleOfferLetterComponent;
  let fixture: ComponentFixture<SampleOfferLetterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SampleOfferLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SampleOfferLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
