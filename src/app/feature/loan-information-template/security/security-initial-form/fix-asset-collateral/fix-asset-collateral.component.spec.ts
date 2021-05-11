import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixAssetCollateralComponent } from './fix-asset-collateral.component';

describe('FixAssetCollateralComponent', () => {
  let component: FixAssetCollateralComponent;
  let fixture: ComponentFixture<FixAssetCollateralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixAssetCollateralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixAssetCollateralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
