import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProposalSummaryComponent } from './proposal-summary.component';

describe('ProposalSummaryComponent', () => {
  let component: ProposalSummaryComponent;
  let fixture: ComponentFixture<ProposalSummaryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProposalSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProposalSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
