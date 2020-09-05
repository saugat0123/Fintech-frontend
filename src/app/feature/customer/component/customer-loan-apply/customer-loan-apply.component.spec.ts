import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerLoanApplyComponent } from './customer-loan-apply.component';

describe('CustomerLoanApplyComponent', () => {
  let component: CustomerLoanApplyComponent;
  let fixture: ComponentFixture<CustomerLoanApplyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerLoanApplyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerLoanApplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
