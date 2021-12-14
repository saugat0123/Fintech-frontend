import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MicroProposalComponent } from './micro-proposal.component';

describe('MicroProposalComponent', () => {
  let component: MicroProposalComponent;
  let fixture: ComponentFixture<MicroProposalComponent>;

  beforeEach(waitForAsync(() => {
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
