import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TrustReceiptNepaliLimitComponent } from './trust-receipt-nepali-limit.component';

describe('TrustReceiptNepaliLimitComponent', () => {
  let component: TrustReceiptNepaliLimitComponent;
  let fixture: ComponentFixture<TrustReceiptNepaliLimitComponent>;

  beforeEach(waitForAsync(() => {
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
