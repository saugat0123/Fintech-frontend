import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Section6LoanLimitRelatedClausesComponent } from './section6-loan-limit-related-clauses.component';

describe('Section5LoanLimitRelatedClausesComponent', () => {
  let component: Section6LoanLimitRelatedClausesComponent;
  let fixture: ComponentFixture<Section6LoanLimitRelatedClausesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Section6LoanLimitRelatedClausesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Section6LoanLimitRelatedClausesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
