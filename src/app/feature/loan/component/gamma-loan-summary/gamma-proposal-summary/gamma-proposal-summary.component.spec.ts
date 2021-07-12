import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GammaProposalSummaryComponent } from './gamma-proposal-summary.component';

describe('GammaProposalSummaryComponent', () => {
  let component: GammaProposalSummaryComponent;
  let fixture: ComponentFixture<GammaProposalSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GammaProposalSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GammaProposalSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
