import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanActionCombinedModalComponent } from './loan-action-combined-modal.component';

describe('LoanActionCombinedModalComponent', () => {
  let component: LoanActionCombinedModalComponent;
  let fixture: ComponentFixture<LoanActionCombinedModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanActionCombinedModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanActionCombinedModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
