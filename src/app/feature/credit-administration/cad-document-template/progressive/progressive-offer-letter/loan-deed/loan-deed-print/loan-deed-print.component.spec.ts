import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanDeedPrintComponent } from './loan-deed-print.component';

describe('LoanDeedPrintComponent', () => {
  let component: LoanDeedPrintComponent;
  let fixture: ComponentFixture<LoanDeedPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanDeedPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanDeedPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
