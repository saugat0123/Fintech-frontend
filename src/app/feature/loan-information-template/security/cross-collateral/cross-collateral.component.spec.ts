import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrossCollateralComponent } from './cross-collateral.component';

describe('CrossCollateralComponent', () => {
  let component: CrossCollateralComponent;
  let fixture: ComponentFixture<CrossCollateralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrossCollateralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrossCollateralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
