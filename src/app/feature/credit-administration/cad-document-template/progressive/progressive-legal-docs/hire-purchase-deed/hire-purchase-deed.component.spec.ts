import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {HirePurchaseDeedComponent} from './hire-purchase-deed.component';

describe('HirePurchaseDeedComponent', () => {
  let component: HirePurchaseDeedComponent;
  let fixture: ComponentFixture<HirePurchaseDeedComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [HirePurchaseDeedComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HirePurchaseDeedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
