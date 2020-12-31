import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HayerPurchaseComponent } from './hayer-purchase.component';

describe('HayerPurchaseComponent', () => {
  let component: HayerPurchaseComponent;
  let fixture: ComponentFixture<HayerPurchaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HayerPurchaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HayerPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
