import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LandAndBuildingSecurityComponent } from './land-and-building-security.component';

describe('LandAndBuildingSecurityComponent', () => {
  let component: LandAndBuildingSecurityComponent;
  let fixture: ComponentFixture<LandAndBuildingSecurityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LandAndBuildingSecurityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LandAndBuildingSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
