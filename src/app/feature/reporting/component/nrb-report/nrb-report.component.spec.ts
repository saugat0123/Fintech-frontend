import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NrbReportComponent } from './nrb-report.component';

describe('NrbReportComponent', () => {
  let component: NrbReportComponent;
  let fixture: ComponentFixture<NrbReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NrbReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NrbReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
