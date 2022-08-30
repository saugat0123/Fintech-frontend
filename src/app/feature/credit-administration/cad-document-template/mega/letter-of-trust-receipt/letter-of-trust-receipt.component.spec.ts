import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LetterOfTrustReceiptComponent } from './letter-of-trust-receipt.component';

describe('LetterOfTrustReceiptComponent', () => {
  let component: LetterOfTrustReceiptComponent;
  let fixture: ComponentFixture<LetterOfTrustReceiptComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LetterOfTrustReceiptComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LetterOfTrustReceiptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
