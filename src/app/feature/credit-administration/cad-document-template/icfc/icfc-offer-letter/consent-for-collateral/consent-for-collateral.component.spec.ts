import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsentForCollateralComponent } from './consent-for-collateral.component';

describe('ConsentForCollateralComponent', () => {
  let component: ConsentForCollateralComponent;
  let fixture: ComponentFixture<ConsentForCollateralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsentForCollateralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsentForCollateralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
