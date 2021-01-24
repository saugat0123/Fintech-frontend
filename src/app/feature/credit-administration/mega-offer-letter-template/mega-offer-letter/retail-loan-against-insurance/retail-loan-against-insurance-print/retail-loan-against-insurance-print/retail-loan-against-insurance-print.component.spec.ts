import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailLoanAgainstInsurancePrintComponent } from './retail-loan-against-insurance-print.component';

describe('RetailLoanAgainstInsurancePrintComponent', () => {
  let component: RetailLoanAgainstInsurancePrintComponent;
  let fixture: ComponentFixture<RetailLoanAgainstInsurancePrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetailLoanAgainstInsurancePrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailLoanAgainstInsurancePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
