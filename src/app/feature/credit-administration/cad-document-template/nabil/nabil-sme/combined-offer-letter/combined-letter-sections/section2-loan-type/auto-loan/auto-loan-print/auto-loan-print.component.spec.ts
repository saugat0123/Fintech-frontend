import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoLoanPrintComponent } from './auto-loan-print.component';

describe('AutoLoanPrintComponent', () => {
  let component: AutoLoanPrintComponent;
  let fixture: ComponentFixture<AutoLoanPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoLoanPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoLoanPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
