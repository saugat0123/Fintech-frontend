import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MicroProposalSummaryComponent } from './micro-proposal-summary.component';

describe('MicroProposalSummaryComponent', () => {
  let component: MicroProposalSummaryComponent;
  let fixture: ComponentFixture<MicroProposalSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MicroProposalSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MicroProposalSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
