import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CustomerWisePendingComponent } from './customer-wise-pending.component';

describe('CustomerWisePendingComponent', () => {
  let component: CustomerWisePendingComponent;
  let fixture: ComponentFixture<CustomerWisePendingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerWisePendingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerWisePendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
