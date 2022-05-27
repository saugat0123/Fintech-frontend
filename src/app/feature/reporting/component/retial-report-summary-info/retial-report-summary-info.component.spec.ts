import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetialReportSummaryInfoComponent } from './retial-report-summary-info.component';

describe('RetialReportSummaryInfoComponent', () => {
  let component: RetialReportSummaryInfoComponent;
  let fixture: ComponentFixture<RetialReportSummaryInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetialReportSummaryInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetialReportSummaryInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
