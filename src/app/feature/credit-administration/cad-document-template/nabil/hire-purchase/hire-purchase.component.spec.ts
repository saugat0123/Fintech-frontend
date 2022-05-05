import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HirePurchaseComponent } from './hire-purchase.component';

describe('HirePurchaseCompanyComponent', () => {
  let component: HirePurchaseComponent;
  let fixture: ComponentFixture<HirePurchaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HirePurchaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HirePurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
