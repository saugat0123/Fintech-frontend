import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HirePurchaseCompanyComponent } from './hire-purchase-company.component';

describe('HirePurchaseCompanyComponent', () => {
  let component: HirePurchaseCompanyComponent;
  let fixture: ComponentFixture<HirePurchaseCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HirePurchaseCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HirePurchaseCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
