import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RetailMortgageLoanComponent } from './retail-mortgage-loan.component';

describe('RetailMortgageLoanComponent', () => {
  let component: RetailMortgageLoanComponent;
  let fixture: ComponentFixture<RetailMortgageLoanComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RetailMortgageLoanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailMortgageLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
