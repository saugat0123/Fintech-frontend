import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleLoanDeedProprietorshipComponent } from './vehicle-loan-deed-proprietorship.component';

describe('VehicleLoanDeedProprietorshipComponent', () => {
  let component: VehicleLoanDeedProprietorshipComponent;
  let fixture: ComponentFixture<VehicleLoanDeedProprietorshipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleLoanDeedProprietorshipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleLoanDeedProprietorshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
