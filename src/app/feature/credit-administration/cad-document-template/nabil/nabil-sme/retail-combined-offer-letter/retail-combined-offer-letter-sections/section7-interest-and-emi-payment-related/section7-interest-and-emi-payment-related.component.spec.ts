import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Section7InterestAndEmiPaymentRelatedComponent } from './section7-interest-and-emi-payment-related.component';

describe('Section7InterestAndEmiPaymentRelatedComponent', () => {
  let component: Section7InterestAndEmiPaymentRelatedComponent;
  let fixture: ComponentFixture<Section7InterestAndEmiPaymentRelatedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Section7InterestAndEmiPaymentRelatedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Section7InterestAndEmiPaymentRelatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
