import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterVehicleThirdPartyPartnershipComponent } from './letter-vehicle-third-party-partnership.component';

describe('LetterVehicleThirdPartyPartnershipComponent', () => {
  let component: LetterVehicleThirdPartyPartnershipComponent;
  let fixture: ComponentFixture<LetterVehicleThirdPartyPartnershipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterVehicleThirdPartyPartnershipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterVehicleThirdPartyPartnershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
