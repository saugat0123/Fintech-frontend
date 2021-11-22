import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanDeedInstitutionalComponent } from './loan-deed-institutional.component';

describe('LoanDeedInstitutionalComponent', () => {
  let component: LoanDeedInstitutionalComponent;
  let fixture: ComponentFixture<LoanDeedInstitutionalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanDeedInstitutionalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanDeedInstitutionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
