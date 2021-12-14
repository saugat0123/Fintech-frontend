import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CustomerLoanInformationViewComponent } from './customer-loan-information-view.component';

describe('CustomerLoanInformationViewComponent', () => {
  let component: CustomerLoanInformationViewComponent;
  let fixture: ComponentFixture<CustomerLoanInformationViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerLoanInformationViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerLoanInformationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
