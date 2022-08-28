import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleLoanDeedCompanyComponent } from './vehicle-loan-deed-company.component';

describe('VehicleLoanDeedCompanyComponent', () => {
  let component: VehicleLoanDeedCompanyComponent;
  let fixture: ComponentFixture<VehicleLoanDeedCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleLoanDeedCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleLoanDeedCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
