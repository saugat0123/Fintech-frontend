import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgricultureOfferLetterComponent } from './agriculture-offer-letter.component';

describe('AgricultureOfferLetterComponent', () => {
  let component: AgricultureOfferLetterComponent;
  let fixture: ComponentFixture<AgricultureOfferLetterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgricultureOfferLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgricultureOfferLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
