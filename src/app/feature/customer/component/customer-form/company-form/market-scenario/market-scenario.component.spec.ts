import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MarketScenarioComponent } from './market-scenario.component';

describe('MarketScenarioComponent', () => {
  let component: MarketScenarioComponent;
  let fixture: ComponentFixture<MarketScenarioComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MarketScenarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarketScenarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
