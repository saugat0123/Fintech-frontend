import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConsentForCollateralPrintComponent } from './consent-for-collateral-print.component';

describe('ConsentForCollateralPrintComponent', () => {
  let component: ConsentForCollateralPrintComponent;
  let fixture: ComponentFixture<ConsentForCollateralPrintComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsentForCollateralPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsentForCollateralPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
