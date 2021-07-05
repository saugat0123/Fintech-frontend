import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanDeedMultipleIcfcPrintComponent } from './loan-deed-multiple-icfc-print.component';

describe('LoanDeedMultipleIcfcPrintComponent', () => {
  let component: LoanDeedMultipleIcfcPrintComponent;
  let fixture: ComponentFixture<LoanDeedMultipleIcfcPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanDeedMultipleIcfcPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanDeedMultipleIcfcPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
