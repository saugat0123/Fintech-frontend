import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralLetterOfTrustReceiptProprietorshipComponent } from './general-letter-of-trust-receipt-proprietorship.component';

describe('GeneralLetterOfTrustReceiptProprietorshipComponent', () => {
  let component: GeneralLetterOfTrustReceiptProprietorshipComponent;
  let fixture: ComponentFixture<GeneralLetterOfTrustReceiptProprietorshipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralLetterOfTrustReceiptProprietorshipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralLetterOfTrustReceiptProprietorshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
