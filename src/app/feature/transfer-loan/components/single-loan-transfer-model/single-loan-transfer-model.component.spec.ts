import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SingleLoanTransferModelComponent } from './single-loan-transfer-model.component';

describe('SingleLoanTransferModelComponent', () => {
  let component: SingleLoanTransferModelComponent;
  let fixture: ComponentFixture<SingleLoanTransferModelComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleLoanTransferModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleLoanTransferModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
