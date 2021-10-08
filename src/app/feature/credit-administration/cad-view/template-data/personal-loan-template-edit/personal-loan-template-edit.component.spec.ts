import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalLoanTemplateEditComponent } from './personal-loan-template-edit.component';

describe('PersonalLoanTemplateEditComponent', () => {
  let component: PersonalLoanTemplateEditComponent;
  let fixture: ComponentFixture<PersonalLoanTemplateEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalLoanTemplateEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalLoanTemplateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
