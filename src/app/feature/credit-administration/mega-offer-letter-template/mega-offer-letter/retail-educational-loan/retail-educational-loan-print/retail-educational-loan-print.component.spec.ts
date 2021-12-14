import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RetailEducationalLoanPrintComponent } from './retail-educational-loan-print.component';

describe('RetailEducationalLoanPrintComponent', () => {
  let component: RetailEducationalLoanPrintComponent;
  let fixture: ComponentFixture<RetailEducationalLoanPrintComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RetailEducationalLoanPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailEducationalLoanPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
