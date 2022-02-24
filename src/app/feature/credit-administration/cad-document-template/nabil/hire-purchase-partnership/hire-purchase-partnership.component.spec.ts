import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HirePurchasePartnershipComponent } from './hire-purchase-partnership.component';

describe('HirePurchasePartnershipComponent', () => {
  let component: HirePurchasePartnershipComponent;
  let fixture: ComponentFixture<HirePurchasePartnershipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HirePurchasePartnershipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HirePurchasePartnershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
