import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleSecurityComponent } from './vehicle-security.component';

describe('VehicleSecurityComponent', () => {
  let component: VehicleSecurityComponent;
  let fixture: ComponentFixture<VehicleSecurityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleSecurityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
