import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailEducationalLoanEnglishPrintComponent } from './retail-educational-loan-english-print.component';

describe('RetailEducationalLoanEnglishPrintComponent', () => {
  let component: RetailEducationalLoanEnglishPrintComponent;
  let fixture: ComponentFixture<RetailEducationalLoanEnglishPrintComponent>;

  beforeEach(async(() => {
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
