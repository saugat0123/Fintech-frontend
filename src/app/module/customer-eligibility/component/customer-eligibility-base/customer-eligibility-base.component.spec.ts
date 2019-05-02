import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerEligibilityBaseComponent } from './customer-eligibility-base.component';

describe('CustomerEligibilityBaseComponent', () => {
  let component: CustomerEligibilityBaseComponent;
  let fixture: ComponentFixture<CustomerEligibilityBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerEligibilityBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerEligibilityBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
