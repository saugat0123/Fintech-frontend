import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketingActivitiesComponent } from './marketing-activities.component';

describe('MarketingActivitiesComponent', () => {
  let component: MarketingActivitiesComponent;
  let fixture: ComponentFixture<MarketingActivitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketingActivitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketingActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
