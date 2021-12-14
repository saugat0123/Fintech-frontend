import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BorrowerLoanPortofolioComponent } from './borrower-loan-portofolio.component';

describe('BorrowerLoanPortofolioComponent', () => {
  let component: BorrowerLoanPortofolioComponent;
  let fixture: ComponentFixture<BorrowerLoanPortofolioComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BorrowerLoanPortofolioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BorrowerLoanPortofolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
