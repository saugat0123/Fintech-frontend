import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MortgageTermLoanComponent } from './mortgage-term-loan.component';

describe('MortgageTermLoanComponent', () => {
  let component: MortgageTermLoanComponent;
  let fixture: ComponentFixture<MortgageTermLoanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MortgageTermLoanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MortgageTermLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
