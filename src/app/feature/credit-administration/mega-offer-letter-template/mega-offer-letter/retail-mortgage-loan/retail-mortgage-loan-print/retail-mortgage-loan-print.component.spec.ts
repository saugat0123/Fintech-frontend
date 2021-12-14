import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RetailMortgageLoanPrintComponent } from './retail-mortgage-loan-print.component';

describe('RetailMortgageLoanPrintComponent', () => {
  let component: RetailMortgageLoanPrintComponent;
  let fixture: ComponentFixture<RetailMortgageLoanPrintComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RetailMortgageLoanPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailMortgageLoanPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
