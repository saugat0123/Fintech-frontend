import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UptoCurrentStatusAndPresentProposalComponent } from './upto-current-status-and-present-proposal.component';

describe('UptoCurrentStatusAndPresentProposalComponent', () => {
  let component: UptoCurrentStatusAndPresentProposalComponent;
  let fixture: ComponentFixture<UptoCurrentStatusAndPresentProposalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UptoCurrentStatusAndPresentProposalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UptoCurrentStatusAndPresentProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
