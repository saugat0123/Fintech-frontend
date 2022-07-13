import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MicroProposalComponent } from './micro-proposal.component';

describe('MicroProposalComponent', () => {
  let component: MicroProposalComponent;
  let fixture: ComponentFixture<MicroProposalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MicroProposalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MicroProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
