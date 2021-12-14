import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {LoanDeedPrintComponent} from './loan-deed-print.component';

describe('LoanDeedPrintComponent', () => {
  let component: LoanDeedPrintComponent;
  let fixture: ComponentFixture<LoanDeedPrintComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LoanDeedPrintComponent]
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
