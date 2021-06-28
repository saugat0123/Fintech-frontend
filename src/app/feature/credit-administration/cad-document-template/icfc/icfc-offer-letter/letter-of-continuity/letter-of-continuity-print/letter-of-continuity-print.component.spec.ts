import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterOfContinuityPrintComponent } from './letter-of-continuity-print.component';

describe('LetterOfContinuityPrintComponent', () => {
  let component: LetterOfContinuityPrintComponent;
  let fixture: ComponentFixture<LetterOfContinuityPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterOfContinuityPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterOfContinuityPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
