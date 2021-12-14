import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CustomerLoanInformationComponent } from './customer-loan-information.component';

describe('CustomerLoanInformationComponent', () => {
  let component: CustomerLoanInformationComponent;
  let fixture: ComponentFixture<CustomerLoanInformationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerLoanInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerLoanInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
