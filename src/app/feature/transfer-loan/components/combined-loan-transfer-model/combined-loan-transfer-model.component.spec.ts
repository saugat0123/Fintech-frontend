import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CombinedLoanTransferModelComponent } from './combined-loan-transfer-model.component';

describe('CombinedLoanTransferModelComponent', () => {
  let component: CombinedLoanTransferModelComponent;
  let fixture: ComponentFixture<CombinedLoanTransferModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CombinedLoanTransferModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CombinedLoanTransferModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
