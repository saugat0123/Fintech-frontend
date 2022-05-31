import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralLetterOfTrustReceiptCompanyComponent } from './general-letter-of-trust-receipt-company.component';

describe('GeneralLetterOfTrustReceiptCompanyComponent', () => {
  let component: GeneralLetterOfTrustReceiptCompanyComponent;
  let fixture: ComponentFixture<GeneralLetterOfTrustReceiptCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralLetterOfTrustReceiptCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralLetterOfTrustReceiptCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
