import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerWiseLoanPullComponent } from './customer-wise-loan-pull.component';

describe('CustomerWiseLoanPullComponent', () => {
  let component: CustomerWiseLoanPullComponent;
  let fixture: ComponentFixture<CustomerWiseLoanPullComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerWiseLoanPullComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerWiseLoanPullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
