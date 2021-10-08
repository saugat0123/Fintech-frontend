import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanDeedPartnershipPrintComponent } from './loan-deed-partnership-print.component';

describe('LoanDeedPartnershipFirmPrintComponent', () => {
  let component: LoanDeedPartnershipPrintComponent;
  let fixture: ComponentFixture<LoanDeedPartnershipPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanDeedPartnershipPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanDeedPartnershipPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
