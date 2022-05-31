import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentaryBillPurchaseNegotiationComponent } from './documentary-bill-purchase-negotiation.component';

describe('DocumentaryBillPurchaseNegotiationComponent', () => {
  let component: DocumentaryBillPurchaseNegotiationComponent;
  let fixture: ComponentFixture<DocumentaryBillPurchaseNegotiationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentaryBillPurchaseNegotiationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentaryBillPurchaseNegotiationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
