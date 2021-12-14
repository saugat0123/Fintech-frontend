import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CustomerLoanEditComponent } from './customer-loan-edit.component';

describe('CustomerLoanEditComponent', () => {
  let component: CustomerLoanEditComponent;
  let fixture: ComponentFixture<CustomerLoanEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerLoanEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerLoanEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
