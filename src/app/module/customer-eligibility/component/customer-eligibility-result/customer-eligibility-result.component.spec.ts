import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerEligibilityResultComponent } from './customer-eligibility-result.component';

describe('CustomerEligibilityResultComponent', () => {
  let component: CustomerEligibilityResultComponent;
  let fixture: ComponentFixture<CustomerEligibilityResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerEligibilityResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerEligibilityResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
