import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrustReceiptNepaliLimitComponent } from './trust-receipt-nepali-limit.component';

describe('TrustReceiptNepaliLimitComponent', () => {
  let component: TrustReceiptNepaliLimitComponent;
  let fixture: ComponentFixture<TrustReceiptNepaliLimitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrustReceiptNepaliLimitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrustReceiptNepaliLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
