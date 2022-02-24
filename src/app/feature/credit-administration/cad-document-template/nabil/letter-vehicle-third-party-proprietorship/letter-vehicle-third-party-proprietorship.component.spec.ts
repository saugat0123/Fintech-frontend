import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterVehicleThirdPartyProprietorshipComponent } from './letter-vehicle-third-party-proprietorship.component';

describe('LetterVehicleThirdPartyProprietorshipComponent', () => {
  let component: LetterVehicleThirdPartyProprietorshipComponent;
  let fixture: ComponentFixture<LetterVehicleThirdPartyProprietorshipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterVehicleThirdPartyProprietorshipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterVehicleThirdPartyProprietorshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
