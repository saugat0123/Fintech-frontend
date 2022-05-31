import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Section12ClausesForLoanReviewComponent } from './section12-clauses-for-loan-review.component';

describe('Section12ClausesForLoanReviewComponent', () => {
  let component: Section12ClausesForLoanReviewComponent;
  let fixture: ComponentFixture<Section12ClausesForLoanReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Section12ClausesForLoanReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Section12ClausesForLoanReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
