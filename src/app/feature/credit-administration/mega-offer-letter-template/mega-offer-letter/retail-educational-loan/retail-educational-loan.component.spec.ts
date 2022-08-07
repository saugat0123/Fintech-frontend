import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailEducationalLoanComponent } from './retail-educational-loan.component';

describe('RetailEducationalLoanComponent', () => {
  let component: RetailEducationalLoanComponent;
  let fixture: ComponentFixture<RetailEducationalLoanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetailEducationalLoanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailEducationalLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
