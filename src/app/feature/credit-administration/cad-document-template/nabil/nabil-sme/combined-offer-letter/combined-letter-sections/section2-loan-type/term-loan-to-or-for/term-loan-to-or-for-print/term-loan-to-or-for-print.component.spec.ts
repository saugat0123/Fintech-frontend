import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TermLoanToOrForPrintComponent } from './term-loan-to-or-for-print.component';

describe('TermLoanToOrForPrintComponent', () => {
  let component: TermLoanToOrForPrintComponent;
  let fixture: ComponentFixture<TermLoanToOrForPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TermLoanToOrForPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TermLoanToOrForPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
