import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalLoanAndPersonalOverdraftTemplateEditComponent } from './personal-loan-and-personal-overdraft-template-edit.component';

describe('PersonalLoanAndPersonalOverdraftTemplateEditComponent', () => {
  let component: PersonalLoanAndPersonalOverdraftTemplateEditComponent;
  let fixture: ComponentFixture<PersonalLoanAndPersonalOverdraftTemplateEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalLoanAndPersonalOverdraftTemplateEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalLoanAndPersonalOverdraftTemplateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
