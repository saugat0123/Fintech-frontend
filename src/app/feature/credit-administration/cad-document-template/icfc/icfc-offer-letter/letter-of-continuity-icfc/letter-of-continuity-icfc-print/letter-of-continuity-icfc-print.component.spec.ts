import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterOfContinuityIcfcPrintComponent } from './letter-of-continuity-icfc-print.component';

describe('LetterOfContinuityIcfcPrintComponent', () => {
  let component: LetterOfContinuityIcfcPrintComponent;
  let fixture: ComponentFixture<LetterOfContinuityIcfcPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterOfContinuityIcfcPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterOfContinuityIcfcPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
