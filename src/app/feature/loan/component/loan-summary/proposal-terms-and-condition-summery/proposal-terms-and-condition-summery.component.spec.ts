import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProposalTermsAndConditionSummeryComponent } from './proposal-terms-and-condition-summery.component';

describe('ProposalTermsAndConditionSummeryComponent', () => {
  let component: ProposalTermsAndConditionSummeryComponent;
  let fixture: ComponentFixture<ProposalTermsAndConditionSummeryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProposalTermsAndConditionSummeryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalTermsAndConditionSummeryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
