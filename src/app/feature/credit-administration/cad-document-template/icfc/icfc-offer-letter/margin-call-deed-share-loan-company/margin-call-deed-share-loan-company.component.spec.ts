import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarginCallDeedShareLoanCompanyComponent } from './margin-call-deed-share-loan-company.component';

describe('MarginCallDeedShareLoanCompanyComponent', () => {
  let component: MarginCallDeedShareLoanCompanyComponent;
  let fixture: ComponentFixture<MarginCallDeedShareLoanCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarginCallDeedShareLoanCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarginCallDeedShareLoanCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
