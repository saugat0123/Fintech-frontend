import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PgRetailLoanPrintComponent } from './pg-retail-loan-print.component';

describe('PgRetailLoanPrintComponent', () => {
  let component: PgRetailLoanPrintComponent;
  let fixture: ComponentFixture<PgRetailLoanPrintComponent>;

  beforeEach(async(() => {
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
