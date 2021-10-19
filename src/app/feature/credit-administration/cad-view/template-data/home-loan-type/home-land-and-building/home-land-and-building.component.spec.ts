import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeLandAndBuildingComponent } from './home-land-and-building.component';

describe('HomeLandAndBuildingComponent', () => {
  let component: HomeLandAndBuildingComponent;
  let fixture: ComponentFixture<HomeLandAndBuildingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeLandAndBuildingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeLandAndBuildingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
