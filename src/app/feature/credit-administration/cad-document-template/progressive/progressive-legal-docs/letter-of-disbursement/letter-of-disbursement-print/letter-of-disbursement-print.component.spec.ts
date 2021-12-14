import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {LetterOfDisbursementPrintComponent} from './letter-of-disbursement-print.component';

describe('LetterOfDisbursementPrintComponent', () => {
  let component: LetterOfDisbursementPrintComponent;
  let fixture: ComponentFixture<LetterOfDisbursementPrintComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LetterOfDisbursementPrintComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterOfDisbursementPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
