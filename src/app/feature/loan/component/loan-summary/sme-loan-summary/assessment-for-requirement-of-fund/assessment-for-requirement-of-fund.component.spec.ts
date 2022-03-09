import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssessmentForRequirementOfFundComponent } from './assessment-for-requirement-of-fund.component';

describe('AssessmentForRequirementOfFundComponent', () => {
  let component: AssessmentForRequirementOfFundComponent;
  let fixture: ComponentFixture<AssessmentForRequirementOfFundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssessmentForRequirementOfFundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssessmentForRequirementOfFundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
