import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Section3SecurityAndCollateralComponent } from './section3-security-and-collateral.component';

describe('Section3SecurityAndCollateralComponent', () => {
  let component: Section3SecurityAndCollateralComponent;
  let fixture: ComponentFixture<Section3SecurityAndCollateralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Section3SecurityAndCollateralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Section3SecurityAndCollateralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
