import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalLoanAndPersonalOverdraftPrintComponent } from './personal-loan-and-personal-overdraft-print.component';

describe('PersonalLoanAndPersonalOverdraftPrintComponent', () => {
  let component: PersonalLoanAndPersonalOverdraftPrintComponent;
  let fixture: ComponentFixture<PersonalLoanAndPersonalOverdraftPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalLoanAndPersonalOverdraftPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalLoanAndPersonalOverdraftPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
