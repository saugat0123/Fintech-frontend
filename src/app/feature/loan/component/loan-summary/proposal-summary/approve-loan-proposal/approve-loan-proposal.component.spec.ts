import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproveLoanProposalComponent } from './approve-loan-proposal.component';

describe('ApproveLoanProposalComponent', () => {
  let component: ApproveLoanProposalComponent;
  let fixture: ComponentFixture<ApproveLoanProposalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApproveLoanProposalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproveLoanProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
