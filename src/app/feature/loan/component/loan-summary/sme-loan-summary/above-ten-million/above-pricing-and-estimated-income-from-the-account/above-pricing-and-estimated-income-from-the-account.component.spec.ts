import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbovePricingAndEstimatedIncomeFromTheAccountComponent } from './above-pricing-and-estimated-income-from-the-account.component';

describe('AbovePricingAndEstimatedIncomeFromTheAccountComponent', () => {
  let component: AbovePricingAndEstimatedIncomeFromTheAccountComponent;
  let fixture: ComponentFixture<AbovePricingAndEstimatedIncomeFromTheAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbovePricingAndEstimatedIncomeFromTheAccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbovePricingAndEstimatedIncomeFromTheAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
