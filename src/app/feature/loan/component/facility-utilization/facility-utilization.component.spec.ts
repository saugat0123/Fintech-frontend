import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityUtilizationComponent } from './facility-utilization.component';

describe('FacilityUtilizationComponent', () => {
  let component: FacilityUtilizationComponent;
  let fixture: ComponentFixture<FacilityUtilizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacilityUtilizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityUtilizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
