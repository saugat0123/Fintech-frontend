import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MortgageOrEquityMortgageTermLoanComponent } from './mortgage-or-equity-mortgage-term-loan.component';

describe('MortgageOrEquityMortgageTermLoanComponent', () => {
  let component: MortgageOrEquityMortgageTermLoanComponent;
  let fixture: ComponentFixture<MortgageOrEquityMortgageTermLoanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MortgageOrEquityMortgageTermLoanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MortgageOrEquityMortgageTermLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
