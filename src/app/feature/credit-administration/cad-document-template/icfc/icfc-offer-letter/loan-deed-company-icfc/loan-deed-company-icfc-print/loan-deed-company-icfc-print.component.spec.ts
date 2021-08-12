import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanDeedCompanyIcfcPrintComponent } from './loan-deed-company-icfc-print.component';

describe('LoanDeedCompanyIcfcPrintComponent', () => {
  let component: LoanDeedCompanyIcfcPrintComponent;
  let fixture: ComponentFixture<LoanDeedCompanyIcfcPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanDeedCompanyIcfcPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanDeedCompanyIcfcPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
