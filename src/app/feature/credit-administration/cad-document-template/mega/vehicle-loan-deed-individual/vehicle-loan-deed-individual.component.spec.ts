import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleLoanDeedIndividualComponent } from './vehicle-loan-deed-individual.component';

describe('VehicleLoanDeedIndividualComponent', () => {
  let component: VehicleLoanDeedIndividualComponent;
  let fixture: ComponentFixture<VehicleLoanDeedIndividualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleLoanDeedIndividualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleLoanDeedIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
