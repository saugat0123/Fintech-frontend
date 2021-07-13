import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {HirePurchaseDeedPrintComponent} from './hire-purchase-deed-print.component';

describe('HirePurchaseDeedPrintComponent', () => {
  let component: HirePurchaseDeedPrintComponent;
  let fixture: ComponentFixture<HirePurchaseDeedPrintComponent>;

  beforeEach(async(() => {
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
