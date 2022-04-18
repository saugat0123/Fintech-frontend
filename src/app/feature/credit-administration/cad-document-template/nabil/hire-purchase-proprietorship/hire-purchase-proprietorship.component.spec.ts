import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HirePurchaseProprietorshipComponent } from './hire-purchase-proprietorship.component';

describe('HirePurchaseProprietorshipComponent', () => {
  let component: HirePurchaseProprietorshipComponent;
  let fixture: ComponentFixture<HirePurchaseProprietorshipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HirePurchaseProprietorshipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HirePurchaseProprietorshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
