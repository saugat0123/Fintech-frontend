import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleNamsariLetterComponent } from './vehicle-namsari-letter.component';

describe('VehicleNamsariLetterComponent', () => {
  let component: VehicleNamsariLetterComponent;
  let fixture: ComponentFixture<VehicleNamsariLetterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleNamsariLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleNamsariLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
