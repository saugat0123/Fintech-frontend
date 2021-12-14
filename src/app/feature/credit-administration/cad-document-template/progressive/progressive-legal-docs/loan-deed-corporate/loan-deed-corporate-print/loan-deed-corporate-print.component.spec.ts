import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LoanDeedCorporatePrintComponent } from './loan-deed-corporate-print.component';

describe('LoanDeedCorporatePrintComponent', () => {
  let component: LoanDeedCorporatePrintComponent;
  let fixture: ComponentFixture<LoanDeedCorporatePrintComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanDeedCorporatePrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanDeedCorporatePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
