import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RetailHousingLoanPrintComponent } from './retail-housing-loan-print.component';

describe('RetailHousingLoanPrintComponent', () => {
  let component: RetailHousingLoanPrintComponent;
  let fixture: ComponentFixture<RetailHousingLoanPrintComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RetailHousingLoanPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailHousingLoanPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
