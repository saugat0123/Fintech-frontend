import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverdraftLoanForWorkingCapitalRequirementComponent } from './overdraft-loan-for-working-capital-requirement.component';

describe('OverdraftLoanForWorkingCapitalRequirementComponent', () => {
  let component: OverdraftLoanForWorkingCapitalRequirementComponent;
  let fixture: ComponentFixture<OverdraftLoanForWorkingCapitalRequirementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverdraftLoanForWorkingCapitalRequirementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverdraftLoanForWorkingCapitalRequirementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
