import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterVehicleThirdpartyCompanyComponent } from './letter-vehicle-thirdparty-company.component';

describe('LetterVehicleThirdpartyCompanyComponent', () => {
  let component: LetterVehicleThirdpartyCompanyComponent;
  let fixture: ComponentFixture<LetterVehicleThirdpartyCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterVehicleThirdpartyCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterVehicleThirdpartyCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
