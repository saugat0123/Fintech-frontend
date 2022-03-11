import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AbovePurposeJustificationForProposalComponent } from './above-purpose-justification-for-proposal.component';

describe('AbovePurposeJustificationForProposalComponent', () => {
  let component: AbovePurposeJustificationForProposalComponent;
  let fixture: ComponentFixture<AbovePurposeJustificationForProposalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AbovePurposeJustificationForProposalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AbovePurposeJustificationForProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
