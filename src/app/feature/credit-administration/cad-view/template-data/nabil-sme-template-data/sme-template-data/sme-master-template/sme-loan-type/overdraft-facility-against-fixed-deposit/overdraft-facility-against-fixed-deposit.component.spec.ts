import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverdraftFacilityAgainstFixedDepositComponent } from './overdraft-facility-against-fixed-deposit.component';

describe('OverdraftFacilityAgainstFixedDepositComponent', () => {
  let component: OverdraftFacilityAgainstFixedDepositComponent;
  let fixture: ComponentFixture<OverdraftFacilityAgainstFixedDepositComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverdraftFacilityAgainstFixedDepositComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverdraftFacilityAgainstFixedDepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
