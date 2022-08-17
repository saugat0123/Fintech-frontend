import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanDeedInstitutionPartnershipFormComponent } from './loan-deed-institution-partnership-form.component';

describe('LoanDeedInstitutionPrivateLimitedComponent', () => {
  let component: LoanDeedInstitutionPartnershipFormComponent;
  let fixture: ComponentFixture<LoanDeedInstitutionPartnershipFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanDeedInstitutionPartnershipFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanDeedInstitutionPartnershipFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
