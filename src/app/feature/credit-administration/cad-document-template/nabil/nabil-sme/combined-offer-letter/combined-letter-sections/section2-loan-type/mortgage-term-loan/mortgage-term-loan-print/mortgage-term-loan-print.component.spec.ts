import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MortgageTermLoanPrintComponent } from './mortgage-term-loan-print.component';

describe('MortgageTermLoanPrintComponent', () => {
  let component: MortgageTermLoanPrintComponent;
  let fixture: ComponentFixture<MortgageTermLoanPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MortgageTermLoanPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MortgageTermLoanPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
