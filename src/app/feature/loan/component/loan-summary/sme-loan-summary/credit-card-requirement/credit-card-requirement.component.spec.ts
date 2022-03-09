import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditCardRequirementComponent } from './credit-card-requirement.component';

describe('CreditCardRequirementComponent', () => {
  let component: CreditCardRequirementComponent;
  let fixture: ComponentFixture<CreditCardRequirementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditCardRequirementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditCardRequirementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
