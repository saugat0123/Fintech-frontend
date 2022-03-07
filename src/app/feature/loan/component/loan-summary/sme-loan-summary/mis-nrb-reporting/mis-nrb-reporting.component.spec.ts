import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MisNrbReportingComponent } from './mis-nrb-reporting.component';

describe('MisNrbReportingComponent', () => {
  let component: MisNrbReportingComponent;
  let fixture: ComponentFixture<MisNrbReportingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisNrbReportingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MisNrbReportingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
