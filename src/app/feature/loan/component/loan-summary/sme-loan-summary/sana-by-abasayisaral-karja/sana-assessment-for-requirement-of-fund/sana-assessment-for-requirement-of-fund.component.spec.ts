import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SanaAssessmentForRequirementOfFundComponent } from './sana-assessment-for-requirement-of-fund.component';

describe('SanaAssessmentForRequirementOfFundComponent', () => {
  let component: SanaAssessmentForRequirementOfFundComponent;
  let fixture: ComponentFixture<SanaAssessmentForRequirementOfFundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SanaAssessmentForRequirementOfFundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SanaAssessmentForRequirementOfFundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
