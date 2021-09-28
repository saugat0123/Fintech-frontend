import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalLoanTemplateDataComponent } from './personal-loan-template-data.component';

describe('PersonalLoanTemplateDataComponent', () => {
  let component: PersonalLoanTemplateDataComponent;
  let fixture: ComponentFixture<PersonalLoanTemplateDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalLoanTemplateDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalLoanTemplateDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
