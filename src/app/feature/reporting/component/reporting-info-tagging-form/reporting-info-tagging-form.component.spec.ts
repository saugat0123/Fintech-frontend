import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportingInfoTaggingFormComponent } from './reporting-info-tagging-form.component';

describe('ReportingInfoTaggingFormComponent', () => {
  let component: ReportingInfoTaggingFormComponent;
  let fixture: ComponentFixture<ReportingInfoTaggingFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportingInfoTaggingFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportingInfoTaggingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
