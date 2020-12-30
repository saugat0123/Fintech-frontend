import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailProfessionalLoanPrintComponent } from './retail-professional-loan-print.component';

describe('RetailProfessionalLoanPrintComponent', () => {
  let component: RetailProfessionalLoanPrintComponent;
  let fixture: ComponentFixture<RetailProfessionalLoanPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetailProfessionalLoanPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailProfessionalLoanPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
