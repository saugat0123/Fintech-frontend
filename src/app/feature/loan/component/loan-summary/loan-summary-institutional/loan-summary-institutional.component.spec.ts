import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanSummaryInstitutionalComponent } from './loan-summary-institutional.component';

describe('LoanSummaryInstitutionalComponent', () => {
  let component: LoanSummaryInstitutionalComponent;
  let fixture: ComponentFixture<LoanSummaryInstitutionalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanSummaryInstitutionalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanSummaryInstitutionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
