import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaxmiOfferLetterComponent } from './laxmi-offer-letter.component';

describe('LaxmiOfferLetterComponent', () => {
  let component: LaxmiOfferLetterComponent;
  let fixture: ComponentFixture<LaxmiOfferLetterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaxmiOfferLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaxmiOfferLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
