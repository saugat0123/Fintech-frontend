import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalLoanCombinedTemplateDataComponent } from './personal-loan-combined-template-data.component';

describe('PersonalLoanCombinedTemplateDataComponent', () => {
  let component: PersonalLoanCombinedTemplateDataComponent;
  let fixture: ComponentFixture<PersonalLoanCombinedTemplateDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalLoanCombinedTemplateDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalLoanCombinedTemplateDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
