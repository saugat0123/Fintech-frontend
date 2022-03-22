import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentRequirementOfFundComponent } from './assessment-requirement-of-fund.component';

describe('AssessmentRequirementOfFundComponent', () => {
  let component: AssessmentRequirementOfFundComponent;
  let fixture: ComponentFixture<AssessmentRequirementOfFundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssessmentRequirementOfFundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentRequirementOfFundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
