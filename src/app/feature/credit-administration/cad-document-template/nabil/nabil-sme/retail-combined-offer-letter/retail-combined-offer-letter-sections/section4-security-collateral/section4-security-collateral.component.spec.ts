import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Section4SecurityCollateralComponent } from './section4-security-collateral.component';

describe('Section4SecurityCollateralComponent', () => {
  let component: Section4SecurityCollateralComponent;
  let fixture: ComponentFixture<Section4SecurityCollateralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Section4SecurityCollateralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Section4SecurityCollateralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
