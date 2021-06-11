import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FixDepositReceiptSecurityComponent } from './fix-deposit-receipt-security.component';

describe('FixDepositReceiptSecurityComponent', () => {
  let component: FixDepositReceiptSecurityComponent;
  let fixture: ComponentFixture<FixDepositReceiptSecurityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FixDepositReceiptSecurityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FixDepositReceiptSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
