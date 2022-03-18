import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailReportCiclComponent } from './retail-report-cicl.component';

describe('RetailReportCiclComponent', () => {
  let component: RetailReportCiclComponent;
  let fixture: ComponentFixture<RetailReportCiclComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetailReportCiclComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailReportCiclComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
