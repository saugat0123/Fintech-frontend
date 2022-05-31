import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportLoanTrustReceiptLoanComponent } from './import-loan-trust-receipt-loan.component';

describe('ImportLoanTrustReceiptLoanComponent', () => {
  let component: ImportLoanTrustReceiptLoanComponent;
  let fixture: ComponentFixture<ImportLoanTrustReceiptLoanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportLoanTrustReceiptLoanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportLoanTrustReceiptLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
