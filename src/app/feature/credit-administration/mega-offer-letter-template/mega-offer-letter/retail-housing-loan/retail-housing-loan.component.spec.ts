import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailHousingLoanComponent } from './retail-housing-loan.component';

describe('RetailHousingLoanComponent', () => {
  let component: RetailHousingLoanComponent;
  let fixture: ComponentFixture<RetailHousingLoanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetailHousingLoanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailHousingLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
