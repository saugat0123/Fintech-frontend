import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MicroLoanSummaryComponent } from './micro-loan-summary.component';

describe('MicroLoanSummaryComponent', () => {
  let component: MicroLoanSummaryComponent;
  let fixture: ComponentFixture<MicroLoanSummaryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MicroLoanSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MicroLoanSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
