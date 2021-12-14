import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CollateralSummaryComponent } from './collateral-summary.component';

describe('CollateralSummaryComponent', () => {
  let component: CollateralSummaryComponent;
  let fixture: ComponentFixture<CollateralSummaryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CollateralSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollateralSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
