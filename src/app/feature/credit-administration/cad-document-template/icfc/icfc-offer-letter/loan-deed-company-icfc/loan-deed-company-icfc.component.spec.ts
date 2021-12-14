import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LoanDeedCompanyIcfcComponent } from './loan-deed-company-icfc.component';

describe('LoanDeedCompanyIcfcComponent', () => {
  let component: LoanDeedCompanyIcfcComponent;
  let fixture: ComponentFixture<LoanDeedCompanyIcfcComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanDeedCompanyIcfcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanDeedCompanyIcfcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
