import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboveRepaymentModalityOfCreditFacilitiesComponent } from './above-repayment-modality-of-credit-facilities.component';

describe('AboveRepaymentModalityOfCreditFacilitiesComponent', () => {
  let component: AboveRepaymentModalityOfCreditFacilitiesComponent;
  let fixture: ComponentFixture<AboveRepaymentModalityOfCreditFacilitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboveRepaymentModalityOfCreditFacilitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboveRepaymentModalityOfCreditFacilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
