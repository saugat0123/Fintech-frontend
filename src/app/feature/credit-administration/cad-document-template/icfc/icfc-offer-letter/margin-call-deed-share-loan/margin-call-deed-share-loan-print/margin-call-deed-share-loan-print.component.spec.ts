import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarginCallDeedShareLoanPrintComponent } from './margin-call-deed-share-loan-print.component';

describe('MarginCallDeedShareLoanPrintComponent', () => {
  let component: MarginCallDeedShareLoanPrintComponent;
  let fixture: ComponentFixture<MarginCallDeedShareLoanPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarginCallDeedShareLoanPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarginCallDeedShareLoanPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
