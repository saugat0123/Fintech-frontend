import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Section8LoanDisbursementRelatedClauseComponent } from './section8-loan-disbursement-related-clause.component';

describe('Section8LoanDisbursementRelatedClauseComponent', () => {
  let component: Section8LoanDisbursementRelatedClauseComponent;
  let fixture: ComponentFixture<Section8LoanDisbursementRelatedClauseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Section8LoanDisbursementRelatedClauseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Section8LoanDisbursementRelatedClauseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
