import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BusinessLoanPrintComponent } from './business-loan-print.component';

describe('BusinessLoanPrintComponent', () => {
  let component: BusinessLoanPrintComponent;
  let fixture: ComponentFixture<BusinessLoanPrintComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessLoanPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessLoanPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
