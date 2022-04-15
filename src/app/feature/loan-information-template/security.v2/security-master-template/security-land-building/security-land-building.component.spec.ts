import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityLandBuildingComponent } from './security-land-building.component';

describe('SecurityLandBuildingComponent', () => {
  let component: SecurityLandBuildingComponent;
  let fixture: ComponentFixture<SecurityLandBuildingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurityLandBuildingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityLandBuildingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
