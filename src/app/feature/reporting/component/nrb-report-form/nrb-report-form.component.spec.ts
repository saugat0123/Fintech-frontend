import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NrbReportFormComponent } from './nrb-report-form.component';

describe('NrbReportFormComponent', () => {
  let component: NrbReportFormComponent;
  let fixture: ComponentFixture<NrbReportFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NrbReportFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NrbReportFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
