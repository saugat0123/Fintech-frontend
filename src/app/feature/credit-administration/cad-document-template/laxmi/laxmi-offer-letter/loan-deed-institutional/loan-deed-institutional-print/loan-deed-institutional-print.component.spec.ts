import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanDeedInstitutionalPrintComponent } from './loan-deed-institutional-print.component';

describe('LoanDeedInstitutionalPrintComponent', () => {
  let component: LoanDeedInstitutionalPrintComponent;
  let fixture: ComponentFixture<LoanDeedInstitutionalPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanDeedInstitutionalPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanDeedInstitutionalPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
