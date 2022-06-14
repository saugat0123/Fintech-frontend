import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminatingProposalComponent } from './terminating-proposal.component';

describe('TerminatingProposalComponent', () => {
  let component: TerminatingProposalComponent;
  let fixture: ComponentFixture<TerminatingProposalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TerminatingProposalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TerminatingProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
