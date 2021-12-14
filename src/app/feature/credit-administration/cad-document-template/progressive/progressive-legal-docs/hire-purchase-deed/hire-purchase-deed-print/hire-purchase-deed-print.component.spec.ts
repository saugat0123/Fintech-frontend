import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {HirePurchaseDeedPrintComponent} from './hire-purchase-deed-print.component';

describe('HirePurchaseDeedPrintComponent', () => {
  let component: HirePurchaseDeedPrintComponent;
  let fixture: ComponentFixture<HirePurchaseDeedPrintComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HirePurchaseDeedPrintComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HirePurchaseDeedPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
