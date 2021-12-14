import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LoanActionCombinedModalComponent } from './loan-action-combined-modal.component';

describe('LoanActionCombinedModalComponent', () => {
  let component: LoanActionCombinedModalComponent;
  let fixture: ComponentFixture<LoanActionCombinedModalComponent>;

  beforeEach(waitForAsync(() => {
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
