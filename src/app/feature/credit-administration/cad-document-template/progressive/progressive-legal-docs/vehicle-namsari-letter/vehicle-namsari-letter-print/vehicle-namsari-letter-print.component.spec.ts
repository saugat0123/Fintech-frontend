import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleNamsariLetterPrintComponent } from './vehicle-namsari-letter-print.component';

describe('VehicleNamsariLetterPrintComponent', () => {
  let component: VehicleNamsariLetterPrintComponent;
  let fixture: ComponentFixture<VehicleNamsariLetterPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleNamsariLetterPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleNamsariLetterPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
