import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmeLoanSummaryComponent } from './sme-loan-summary.component';

describe('SmeLoanSummaryComponent', () => {
  let component: SmeLoanSummaryComponent;
  let fixture: ComponentFixture<SmeLoanSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmeLoanSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmeLoanSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
