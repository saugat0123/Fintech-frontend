import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HsovPendingComponent } from './hsov-pending.component';

describe('HsovPendingComponent', () => {
  let component: HsovPendingComponent;
  let fixture: ComponentFixture<HsovPendingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HsovPendingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HsovPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
