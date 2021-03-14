import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BaselRiskExposureComponent } from './basel-risk-exposure.component';

describe('BaselRiskExposureComponent', () => {
  let component: BaselRiskExposureComponent;
  let fixture: ComponentFixture<BaselRiskExposureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BaselRiskExposureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaselRiskExposureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
