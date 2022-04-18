import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Section3SecurityAndCollateralPrintComponent } from './section3-security-and-collateral-print.component';

describe('Section3SecurityAndCollateralPrintComponent', () => {
  let component: Section3SecurityAndCollateralPrintComponent;
  let fixture: ComponentFixture<Section3SecurityAndCollateralPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Section3SecurityAndCollateralPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Section3SecurityAndCollateralPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
