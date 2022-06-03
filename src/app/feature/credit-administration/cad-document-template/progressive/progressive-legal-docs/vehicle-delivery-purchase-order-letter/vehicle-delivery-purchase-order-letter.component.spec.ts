import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehicleDeliveryPurchaseOrderLetterComponent } from './vehicle-delivery-purchase-order-letter.component';

describe('VehicleDeliveryPurchaseOrderLetterComponent', () => {
  let component: VehicleDeliveryPurchaseOrderLetterComponent;
  let fixture: ComponentFixture<VehicleDeliveryPurchaseOrderLetterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehicleDeliveryPurchaseOrderLetterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehicleDeliveryPurchaseOrderLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
