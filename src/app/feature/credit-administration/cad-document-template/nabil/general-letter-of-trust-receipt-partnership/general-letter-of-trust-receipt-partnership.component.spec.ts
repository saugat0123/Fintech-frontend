import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralLetterOfTrustReceiptPartnershipComponent } from './general-letter-of-trust-receipt-partnership.component';

describe('GeneralLetterOfTrustReceiptPartnershipComponent', () => {
  let component: GeneralLetterOfTrustReceiptPartnershipComponent;
  let fixture: ComponentFixture<GeneralLetterOfTrustReceiptPartnershipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralLetterOfTrustReceiptPartnershipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralLetterOfTrustReceiptPartnershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
