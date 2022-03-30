import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SanaCurrentStatusAndPresentProposalComponent } from './sana-current-status-and-present-proposal.component';

describe('SanaCurrentStatusAndPresentProposalComponent', () => {
  let component: SanaCurrentStatusAndPresentProposalComponent;
  let fixture: ComponentFixture<SanaCurrentStatusAndPresentProposalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SanaCurrentStatusAndPresentProposalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SanaCurrentStatusAndPresentProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
