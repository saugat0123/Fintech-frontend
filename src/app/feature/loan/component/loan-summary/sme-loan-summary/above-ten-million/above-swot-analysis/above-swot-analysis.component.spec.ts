import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboveSwotAnalysisComponent } from './above-swot-analysis.component';

describe('AboveSwotAnalysisComponent', () => {
  let component: AboveSwotAnalysisComponent;
  let fixture: ComponentFixture<AboveSwotAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboveSwotAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboveSwotAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
