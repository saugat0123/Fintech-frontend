import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsentLetterForHpLoanPrintComponent } from './consent-letter-for-hp-loan-print.component';

describe('ConsentLetterForHpLoanPrintComponent', () => {
  let component: ConsentLetterForHpLoanPrintComponent;
  let fixture: ComponentFixture<ConsentLetterForHpLoanPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsentLetterForHpLoanPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsentLetterForHpLoanPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
