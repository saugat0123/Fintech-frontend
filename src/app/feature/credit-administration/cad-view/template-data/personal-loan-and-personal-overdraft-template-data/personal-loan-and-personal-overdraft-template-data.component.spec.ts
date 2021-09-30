import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalLoanAndPersonalOverdraftTemplateDataComponent } from './personal-loan-and-personal-overdraft-template-data.component';

describe('PersonalLoanAndPersonalOverdraftTemplateDataComponent', () => {
  let component: PersonalLoanAndPersonalOverdraftTemplateDataComponent;
  let fixture: ComponentFixture<PersonalLoanAndPersonalOverdraftTemplateDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalLoanAndPersonalOverdraftTemplateDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalLoanAndPersonalOverdraftTemplateDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
