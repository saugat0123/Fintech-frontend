import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NabilLoanDeedCompanyComponent } from './nabil-loan-deed-company.component';

describe('NabilLoanDeedCompanyComponent', () => {
  let component: NabilLoanDeedCompanyComponent;
  let fixture: ComponentFixture<NabilLoanDeedCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NabilLoanDeedCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NabilLoanDeedCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
