import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MortgageEquityTermLoanComponent } from './mortgage-equity-term-loan.component';

describe('MortgageEquityTermLoanComponent', () => {
  let component: MortgageEquityTermLoanComponent;
  let fixture: ComponentFixture<MortgageEquityTermLoanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MortgageEquityTermLoanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MortgageEquityTermLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
