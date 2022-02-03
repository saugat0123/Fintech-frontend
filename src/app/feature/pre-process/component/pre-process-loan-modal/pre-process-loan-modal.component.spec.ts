import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreProcessLoanModalComponent } from './pre-process-loan-modal.component';

describe('PreProcessLoanModalComponent', () => {
  let component: PreProcessLoanModalComponent;
  let fixture: ComponentFixture<PreProcessLoanModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreProcessLoanModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreProcessLoanModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
