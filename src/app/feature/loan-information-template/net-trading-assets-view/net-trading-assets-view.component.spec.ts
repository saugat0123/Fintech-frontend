import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetTradingAssetsViewComponent } from './net-trading-assets-view.component';

describe('NetTradingAssetsViewComponent', () => {
  let component: NetTradingAssetsViewComponent;
  let fixture: ComponentFixture<NetTradingAssetsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetTradingAssetsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetTradingAssetsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
