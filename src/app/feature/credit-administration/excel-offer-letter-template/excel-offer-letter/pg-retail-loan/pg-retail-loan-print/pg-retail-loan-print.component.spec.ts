import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PgRetailLoanPrintComponent } from './pg-retail-loan-print.component';

describe('PgRetailLoanPrintComponent', () => {
  let component: PgRetailLoanPrintComponent;
  let fixture: ComponentFixture<PgRetailLoanPrintComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PgRetailLoanPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PgRetailLoanPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
