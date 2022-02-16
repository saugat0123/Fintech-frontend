import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditFacilityReportComponent } from './credit-facility-report.component';

describe('CreditFacilityReportComponent', () => {
  let component: CreditFacilityReportComponent;
  let fixture: ComponentFixture<CreditFacilityReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditFacilityReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditFacilityReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
