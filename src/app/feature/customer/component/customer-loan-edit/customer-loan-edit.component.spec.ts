import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerLoanEditComponent } from './customer-loan-edit.component';

describe('CustomerLoanEditComponent', () => {
  let component: CustomerLoanEditComponent;
  let fixture: ComponentFixture<CustomerLoanEditComponent>;

  beforeEach(async(() => {
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
