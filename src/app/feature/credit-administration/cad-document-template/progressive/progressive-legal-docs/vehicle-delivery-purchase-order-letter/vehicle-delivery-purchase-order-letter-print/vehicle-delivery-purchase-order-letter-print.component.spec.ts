import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleDeliveryPurchaseOrderLetterPrintComponent } from './vehicle-delivery-purchase-order-letter-print.component';

describe('VehicleDeliveryPurchaseOrderLetterPrintComponent', () => {
  let component: VehicleDeliveryPurchaseOrderLetterPrintComponent;
  let fixture: ComponentFixture<VehicleDeliveryPurchaseOrderLetterPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleDeliveryPurchaseOrderLetterPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleDeliveryPurchaseOrderLetterPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
