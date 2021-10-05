import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationalLoanTemplateEditComponent } from './educational-loan-template-edit.component';

describe('EducationalLoanTemplateEditComponent', () => {
  let component: EducationalLoanTemplateEditComponent;
  let fixture: ComponentFixture<EducationalLoanTemplateEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EducationalLoanTemplateEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EducationalLoanTemplateEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
