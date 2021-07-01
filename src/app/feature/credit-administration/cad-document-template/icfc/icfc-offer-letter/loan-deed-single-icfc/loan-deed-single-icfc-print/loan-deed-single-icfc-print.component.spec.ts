import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanDeedSingleIcfcPrintComponent } from './loan-deed-single-icfc-print.component';

describe('LoanDeedSingleIcfcPrintComponent', () => {
  let component: LoanDeedSingleIcfcPrintComponent;
  let fixture: ComponentFixture<LoanDeedSingleIcfcPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanDeedSingleIcfcPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanDeedSingleIcfcPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
