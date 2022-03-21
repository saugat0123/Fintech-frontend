import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupCreditFacilityReportComponent } from './group-credit-facility-report.component';

describe('GroupCreditFacilityReportComponent', () => {
  let component: GroupCreditFacilityReportComponent;
  let fixture: ComponentFixture<GroupCreditFacilityReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupCreditFacilityReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupCreditFacilityReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
