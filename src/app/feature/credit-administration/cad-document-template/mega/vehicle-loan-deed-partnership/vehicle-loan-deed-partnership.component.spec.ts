import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleLoanDeedPartnershipComponent } from './vehicle-loan-deed-partnership.component';

describe('VehicleLoanDeedPartnershipComponent', () => {
  let component: VehicleLoanDeedPartnershipComponent;
  let fixture: ComponentFixture<VehicleLoanDeedPartnershipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleLoanDeedPartnershipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleLoanDeedPartnershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
