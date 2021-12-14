import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ApplicantFamilyInfoPrintComponent } from './applicant-family-info-print.component';

describe('ApplicantFamilyInfoPrintComponent', () => {
  let component: ApplicantFamilyInfoPrintComponent;
  let fixture: ComponentFixture<ApplicantFamilyInfoPrintComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicantFamilyInfoPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicantFamilyInfoPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
