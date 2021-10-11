import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterVehicleIndividualPrintComponent } from './letter-vehicle-individual-print.component';

describe('LetterVehicleIndividualPrintComponent', () => {
  let component: LetterVehicleIndividualPrintComponent;
  let fixture: ComponentFixture<LetterVehicleIndividualPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterVehicleIndividualPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterVehicleIndividualPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
