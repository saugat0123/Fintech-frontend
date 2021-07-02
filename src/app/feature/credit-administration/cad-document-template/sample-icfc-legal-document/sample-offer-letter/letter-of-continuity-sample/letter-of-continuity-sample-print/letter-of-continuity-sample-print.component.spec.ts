import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterOfContinuitySamplePrintComponent } from './letter-of-continuity-sample-print.component';

describe('LetterOfContinuitySamplePrintComponent', () => {
  let component: LetterOfContinuitySamplePrintComponent;
  let fixture: ComponentFixture<LetterOfContinuitySamplePrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterOfContinuitySamplePrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterOfContinuitySamplePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
