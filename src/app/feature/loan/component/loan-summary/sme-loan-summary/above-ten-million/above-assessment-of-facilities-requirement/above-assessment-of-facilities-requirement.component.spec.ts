import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboveAssessmentOfFacilitiesRequirementComponent } from './above-assessment-of-facilities-requirement.component';

describe('AboveAssessmentOfFacilitiesRequirementComponent', () => {
  let component: AboveAssessmentOfFacilitiesRequirementComponent;
  let fixture: ComponentFixture<AboveAssessmentOfFacilitiesRequirementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboveAssessmentOfFacilitiesRequirementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboveAssessmentOfFacilitiesRequirementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
