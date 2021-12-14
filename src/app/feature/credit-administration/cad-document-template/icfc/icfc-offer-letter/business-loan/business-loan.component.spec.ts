import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BusinessLoanComponent } from './business-loan.component';

describe('BusinessLoanComponent', () => {
  let component: BusinessLoanComponent;
  let fixture: ComponentFixture<BusinessLoanComponent>;

  beforeEach(waitForAsync(() => {
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
