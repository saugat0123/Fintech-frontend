import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowerPortfolioSummaryComponent } from './borrower-portfolio-summary.component';

describe('BorrowerPortfolioSummaryComponent', () => {
  let component: BorrowerPortfolioSummaryComponent;
  let fixture: ComponentFixture<BorrowerPortfolioSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BorrowerPortfolioSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BorrowerPortfolioSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
