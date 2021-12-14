import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LoanDeedSingleComponent } from './loan-deed-single.component';

describe('LoanDeedSingleComponent', () => {
  let component: LoanDeedSingleComponent;
  let fixture: ComponentFixture<LoanDeedSingleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanDeedSingleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanDeedSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
