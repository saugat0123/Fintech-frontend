import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketScenarioComponent } from './market-scenario.component';

describe('MarketScenarioComponent', () => {
  let component: MarketScenarioComponent;
  let fixture: ComponentFixture<MarketScenarioComponent>;

  beforeEach(async(() => {
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
