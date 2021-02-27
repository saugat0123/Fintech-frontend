import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowerFinancialComponent } from './borrower-financial.component';

describe('BorrowerFinancialComponent', () => {
  let component: BorrowerFinancialComponent;
  let fixture: ComponentFixture<BorrowerFinancialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BorrowerFinancialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BorrowerFinancialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
