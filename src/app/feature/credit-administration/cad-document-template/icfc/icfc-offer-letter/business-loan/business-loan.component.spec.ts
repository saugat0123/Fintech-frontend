import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessLoanComponent } from './business-loan.component';

describe('BusinessLoanComponent', () => {
  let component: BusinessLoanComponent;
  let fixture: ComponentFixture<BusinessLoanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessLoanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
