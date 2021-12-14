import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LetterOfContinuityInstitutionalPrintComponent } from './letter-of-continuity-institutional-print.component';

describe('LetterOfContinuityInstitutionalPrintComponent', () => {
  let component: LetterOfContinuityInstitutionalPrintComponent;
  let fixture: ComponentFixture<LetterOfContinuityInstitutionalPrintComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterOfContinuityInstitutionalPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterOfContinuityInstitutionalPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
