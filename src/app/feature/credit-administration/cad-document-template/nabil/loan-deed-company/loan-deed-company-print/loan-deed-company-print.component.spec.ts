import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanDeedCompanyPrintComponent } from './loan-deed-company-print.component';

describe('LoanDeedCompanyPrintComponent', () => {
  let component: LoanDeedCompanyPrintComponent;
  let fixture: ComponentFixture<LoanDeedCompanyPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanDeedCompanyPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanDeedCompanyPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
