import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LoanDeedCompanyComponent } from './loan-deed-company.component';

describe('LoanDeedCompanyComponent', () => {
  let component: LoanDeedCompanyComponent;
  let fixture: ComponentFixture<LoanDeedCompanyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanDeedCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanDeedCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});