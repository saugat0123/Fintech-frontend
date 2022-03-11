import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboveFixedAssetsCollateralComputationSheetComponent } from './above-fixed-assets-collateral-computation-sheet.component';

describe('AboveFixedAssetsCollateralComputationSheetComponent', () => {
  let component: AboveFixedAssetsCollateralComputationSheetComponent;
  let fixture: ComponentFixture<AboveFixedAssetsCollateralComputationSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboveFixedAssetsCollateralComputationSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboveFixedAssetsCollateralComputationSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
