import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterVehicleThirdpartyCompanyPrintComponent } from './letter-vehicle-thirdparty-company-print.component';

describe('LetterVehicleThirdpartyCompanyPrintComponent', () => {
  let component: LetterVehicleThirdpartyCompanyPrintComponent;
  let fixture: ComponentFixture<LetterVehicleThirdpartyCompanyPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterVehicleThirdpartyCompanyPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterVehicleThirdpartyCompanyPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
