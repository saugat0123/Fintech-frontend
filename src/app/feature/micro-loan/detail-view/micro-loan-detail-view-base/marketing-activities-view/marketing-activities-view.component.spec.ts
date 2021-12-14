import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MarketingActivitiesViewComponent } from './marketing-activities-view.component';

describe('MarketingActivitiesViewComponent', () => {
  let component: MarketingActivitiesViewComponent;
  let fixture: ComponentFixture<MarketingActivitiesViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketingActivitiesViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketingActivitiesViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
