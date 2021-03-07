import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingActivitiesSummaryComponent } from './marketing-activities-summary.component';

describe('MarketingActivitiesSummaryComponent', () => {
  let component: MarketingActivitiesSummaryComponent;
  let fixture: ComponentFixture<MarketingActivitiesSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketingActivitiesSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketingActivitiesSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
