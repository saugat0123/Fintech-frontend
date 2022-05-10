import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandBuildingAdderComponent } from './land-building-adder.component';

describe('LandBuildingAdderComponent', () => {
  let component: LandBuildingAdderComponent;
  let fixture: ComponentFixture<LandBuildingAdderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandBuildingAdderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandBuildingAdderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
