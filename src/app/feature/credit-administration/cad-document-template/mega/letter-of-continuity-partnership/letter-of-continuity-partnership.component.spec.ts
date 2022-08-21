import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterOfContinuityPartnershipComponent } from './letter-of-continuity-partnership.component';

describe('LetterOfContinuityPartnershipComponent', () => {
  let component: LetterOfContinuityPartnershipComponent;
  let fixture: ComponentFixture<LetterOfContinuityPartnershipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterOfContinuityPartnershipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterOfContinuityPartnershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
