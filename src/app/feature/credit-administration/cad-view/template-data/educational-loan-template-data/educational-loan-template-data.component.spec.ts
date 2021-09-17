import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationalLoanTemplateDataComponent } from './educational-loan-template-data.component';

describe('EducationalLoanTemplateDataComponent', () => {
  let component: EducationalLoanTemplateDataComponent;
  let fixture: ComponentFixture<EducationalLoanTemplateDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EducationalLoanTemplateDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EducationalLoanTemplateDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
