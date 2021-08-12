import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailMortgageLoanComponent } from './retail-mortgage-loan.component';

describe('RetailMortgageLoanComponent', () => {
  let component: RetailMortgageLoanComponent;
  let fixture: ComponentFixture<RetailMortgageLoanComponent>;

  beforeEach(async(() => {
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
