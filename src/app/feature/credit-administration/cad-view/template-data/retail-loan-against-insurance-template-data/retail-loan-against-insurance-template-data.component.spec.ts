import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailLoanAgainstInsuranceTemplateDataComponent } from './retail-loan-against-insurance-template-data.component';

describe('RetailLoanAgainstInsuranceTemplateDataComponent', () => {
  let component: RetailLoanAgainstInsuranceTemplateDataComponent;
  let fixture: ComponentFixture<RetailLoanAgainstInsuranceTemplateDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetailLoanAgainstInsuranceTemplateDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailLoanAgainstInsuranceTemplateDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
