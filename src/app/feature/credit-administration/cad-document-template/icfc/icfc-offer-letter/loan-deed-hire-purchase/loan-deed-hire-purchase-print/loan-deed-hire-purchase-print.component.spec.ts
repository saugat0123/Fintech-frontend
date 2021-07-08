import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanDeedHirePurchasePrintComponent } from './loan-deed-hire-purchase-print.component';

describe('LoanDeedHirePurchasePrintComponent', () => {
  let component: LoanDeedHirePurchasePrintComponent;
  let fixture: ComponentFixture<LoanDeedHirePurchasePrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanDeedHirePurchasePrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanDeedHirePurchasePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
