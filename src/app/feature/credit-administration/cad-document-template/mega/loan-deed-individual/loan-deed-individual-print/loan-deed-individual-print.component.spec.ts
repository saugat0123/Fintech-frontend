import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanDeedIndividualPrintComponent } from './loan-deed-individual-print.component';

describe('LoanDeedIndividualPrintComponent', () => {
  let component: LoanDeedIndividualPrintComponent;
  let fixture: ComponentFixture<LoanDeedIndividualPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanDeedIndividualPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanDeedIndividualPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
