import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Section4LoanLimitPrintComponent } from './section4-loan-limit-print.component';

describe('Section4LoanLimitPrintComponent', () => {
  let component: Section4LoanLimitPrintComponent;
  let fixture: ComponentFixture<Section4LoanLimitPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Section4LoanLimitPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Section4LoanLimitPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
