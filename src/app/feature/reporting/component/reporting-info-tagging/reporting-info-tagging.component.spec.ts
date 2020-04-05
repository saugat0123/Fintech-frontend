import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportingInfoTaggingComponent } from './reporting-info-tagging.component';

describe('ReportingInfoTaggingComponent', () => {
  let component: ReportingInfoTaggingComponent;
  let fixture: ComponentFixture<ReportingInfoTaggingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportingInfoTaggingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportingInfoTaggingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
