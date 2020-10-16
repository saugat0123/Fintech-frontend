import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetTradingAssetsSummaryComponent } from './net-trading-assets-summary.component';

describe('NetTradingAssetsSummaryComponent', () => {
  let component: NetTradingAssetsSummaryComponent;
  let fixture: ComponentFixture<NetTradingAssetsSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetTradingAssetsSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetTradingAssetsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
