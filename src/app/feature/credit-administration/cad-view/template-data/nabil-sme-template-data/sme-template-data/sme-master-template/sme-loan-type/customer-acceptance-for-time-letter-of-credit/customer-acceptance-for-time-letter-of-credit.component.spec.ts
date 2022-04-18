import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerAcceptanceForTimeLetterOfCreditComponent } from './customer-acceptance-for-time-letter-of-credit.component';

describe('CustomerAcceptanceForTimeLetterOfCreditComponent', () => {
  let component: CustomerAcceptanceForTimeLetterOfCreditComponent;
  let fixture: ComponentFixture<CustomerAcceptanceForTimeLetterOfCreditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomerAcceptanceForTimeLetterOfCreditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerAcceptanceForTimeLetterOfCreditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
