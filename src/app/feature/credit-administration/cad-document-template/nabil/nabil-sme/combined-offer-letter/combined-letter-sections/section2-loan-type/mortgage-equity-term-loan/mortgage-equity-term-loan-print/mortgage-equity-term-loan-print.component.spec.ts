import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MortgageEquityTermLoanPrintComponent } from './mortgage-equity-term-loan-print.component';

describe('MortgageEquityTermLoanPrintComponent', () => {
  let component: MortgageEquityTermLoanPrintComponent;
  let fixture: ComponentFixture<MortgageEquityTermLoanPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MortgageEquityTermLoanPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MortgageEquityTermLoanPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
