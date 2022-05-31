import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanSummaryIndividualComponent } from './loan-summary-individual.component';

describe('LoanSummaryIndividualComponent', () => {
  let component: LoanSummaryIndividualComponent;
  let fixture: ComponentFixture<LoanSummaryIndividualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanSummaryIndividualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanSummaryIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
