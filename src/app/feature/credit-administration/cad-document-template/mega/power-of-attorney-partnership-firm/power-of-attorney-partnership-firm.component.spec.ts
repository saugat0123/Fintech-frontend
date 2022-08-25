import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PowerOfAttorneyPartnershipFirmComponent } from './power-of-attorney-partnership-firm.component';

describe('PowerOfAttorneyPartnershipFirmComponent', () => {
  let component: PowerOfAttorneyPartnershipFirmComponent;
  let fixture: ComponentFixture<PowerOfAttorneyPartnershipFirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PowerOfAttorneyPartnershipFirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PowerOfAttorneyPartnershipFirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
