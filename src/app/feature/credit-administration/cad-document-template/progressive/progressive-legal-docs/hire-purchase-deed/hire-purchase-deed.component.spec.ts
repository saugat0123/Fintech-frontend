import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {HirePurchaseDeedComponent} from './hire-purchase-deed.component';

describe('HirePurchaseDeedComponent', () => {
  let component: HirePurchaseDeedComponent;
  let fixture: ComponentFixture<HirePurchaseDeedComponent>;

  beforeEach(async(() => {
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
