import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MicroProposalViewComponent } from './micro-proposal-view.component';

describe('MicroProposalViewComponent', () => {
  let component: MicroProposalViewComponent;
  let fixture: ComponentFixture<MicroProposalViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MicroProposalViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MicroProposalViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
