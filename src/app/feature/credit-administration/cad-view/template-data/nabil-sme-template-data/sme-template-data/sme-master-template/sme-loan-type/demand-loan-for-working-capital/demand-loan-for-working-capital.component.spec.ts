import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemandLoanForWorkingCapitalComponent } from './demand-loan-for-working-capital.component';

describe('DemandLoanForWorkingCapitalComponent', () => {
  let component: DemandLoanForWorkingCapitalComponent;
  let fixture: ComponentFixture<DemandLoanForWorkingCapitalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemandLoanForWorkingCapitalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemandLoanForWorkingCapitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
