import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboveRiskAnalysisComponent } from './above-risk-analysis.component';

describe('AboveRiskAnalysisComponent', () => {
  let component: AboveRiskAnalysisComponent;
  let fixture: ComponentFixture<AboveRiskAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboveRiskAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboveRiskAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
