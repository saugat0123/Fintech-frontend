import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboveBankingArrangementOfTheCustomerComponent } from './above-banking-arrangement-of-the-customer.component';

describe('AboveBankingArrangementOfTheCustomerComponent', () => {
  let component: AboveBankingArrangementOfTheCustomerComponent;
  let fixture: ComponentFixture<AboveBankingArrangementOfTheCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboveBankingArrangementOfTheCustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboveBankingArrangementOfTheCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
