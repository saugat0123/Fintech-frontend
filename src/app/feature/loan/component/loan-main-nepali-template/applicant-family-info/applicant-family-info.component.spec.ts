import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ApplicantFamilyInfoComponent } from './applicant-family-info.component';

describe('ApplicantFamilyInfoComponent', () => {
  let component: ApplicantFamilyInfoComponent;
  let fixture: ComponentFixture<ApplicantFamilyInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicantFamilyInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicantFamilyInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
