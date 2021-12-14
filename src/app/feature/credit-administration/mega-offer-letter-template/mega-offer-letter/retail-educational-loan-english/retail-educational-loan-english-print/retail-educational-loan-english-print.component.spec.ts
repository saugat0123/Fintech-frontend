import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RetailEducationalLoanEnglishPrintComponent } from './retail-educational-loan-english-print.component';

describe('RetailEducationalLoanEnglishPrintComponent', () => {
  let component: RetailEducationalLoanEnglishPrintComponent;
  let fixture: ComponentFixture<RetailEducationalLoanEnglishPrintComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RetailEducationalLoanEnglishPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailEducationalLoanEnglishPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
