import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HypothecationChargeOverFixedAssetsComponent } from './hypothecation-charge-over-fixed-assets.component';

describe('HypothecationChargeOverFixedAssetsComponent', () => {
  let component: HypothecationChargeOverFixedAssetsComponent;
  let fixture: ComponentFixture<HypothecationChargeOverFixedAssetsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HypothecationChargeOverFixedAssetsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HypothecationChargeOverFixedAssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
