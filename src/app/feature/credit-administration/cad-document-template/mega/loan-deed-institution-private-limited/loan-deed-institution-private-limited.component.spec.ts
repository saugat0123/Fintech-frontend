import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanDeedInstitutionPrivateLimitedComponent } from './loan-deed-institution-private-limited.component';

describe('LoanDeedInstitutionPrivateLimitedComponent', () => {
  let component: LoanDeedInstitutionPrivateLimitedComponent;
  let fixture: ComponentFixture<LoanDeedInstitutionPrivateLimitedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanDeedInstitutionPrivateLimitedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanDeedInstitutionPrivateLimitedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
