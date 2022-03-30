import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SanaMisNrbReportingComponent } from './sana-mis-nrb-reporting.component';

describe('SanaMisNrbReportingComponent', () => {
  let component: SanaMisNrbReportingComponent;
  let fixture: ComponentFixture<SanaMisNrbReportingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SanaMisNrbReportingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SanaMisNrbReportingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
