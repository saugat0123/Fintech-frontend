import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReportDashboardComponent } from './report-dashboard.component';

describe('ReportDashboardComponent', () => {
  let component: ReportDashboardComponent;
  let fixture: ComponentFixture<ReportDashboardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
