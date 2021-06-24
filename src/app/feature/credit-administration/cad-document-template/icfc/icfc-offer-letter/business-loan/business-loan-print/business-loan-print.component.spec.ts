import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessLoanPrintComponent } from './business-loan-print.component';

describe('BusinessLoanPrintComponent', () => {
  let component: BusinessLoanPrintComponent;
  let fixture: ComponentFixture<BusinessLoanPrintComponent>;

  beforeEach(async(() => {
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
