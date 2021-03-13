import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MicroProposalViewComponent } from './micro-proposal-view.component';

describe('MicroProposalViewComponent', () => {
  let component: MicroProposalViewComponent;
  let fixture: ComponentFixture<MicroProposalViewComponent>;

  beforeEach(async(() => {
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
