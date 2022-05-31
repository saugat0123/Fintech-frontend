import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationLoanCombinedTemplateDataComponent } from './education-loan-combined-template-data.component';

describe('EducationLoanCombinedTemplateDataComponent', () => {
  let component: EducationLoanCombinedTemplateDataComponent;
  let fixture: ComponentFixture<EducationLoanCombinedTemplateDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EducationLoanCombinedTemplateDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EducationLoanCombinedTemplateDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
