import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixedAssetsCollateralFormComponent } from './fixed-assets-collateral-form.component';

describe('FixedAssetsCollateralFormComponent', () => {
  let component: FixedAssetsCollateralFormComponent;
  let fixture: ComponentFixture<FixedAssetsCollateralFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixedAssetsCollateralFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixedAssetsCollateralFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
