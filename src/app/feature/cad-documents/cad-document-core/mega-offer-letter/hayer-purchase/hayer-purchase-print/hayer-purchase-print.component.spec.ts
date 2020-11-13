import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HayerPurchasePrintComponent } from './hayer-purchase-print.component';

describe('HayerPurchasePrintComponent', () => {
  let component: HayerPurchasePrintComponent;
  let fixture: ComponentFixture<HayerPurchasePrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HayerPurchasePrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HayerPurchasePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
