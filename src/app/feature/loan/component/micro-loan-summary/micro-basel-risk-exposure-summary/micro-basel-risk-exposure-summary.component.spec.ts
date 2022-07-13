import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MicroBaselRiskExposureSummaryComponent } from './micro-basel-risk-exposure-summary.component';

describe('MicroBaselRiskExposureSummaryComponent', () => {
  let component: MicroBaselRiskExposureSummaryComponent;
  let fixture: ComponentFixture<MicroBaselRiskExposureSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MicroBaselRiskExposureSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MicroBaselRiskExposureSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
