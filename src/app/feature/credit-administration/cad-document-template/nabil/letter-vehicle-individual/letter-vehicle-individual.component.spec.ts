import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterVehicleIndividualComponent } from './letter-vehicle-individual.component';

describe('LetterVehicleIndividualComponent', () => {
  let component: LetterVehicleIndividualComponent;
  let fixture: ComponentFixture<LetterVehicleIndividualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterVehicleIndividualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterVehicleIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
