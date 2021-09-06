import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CadReportComponent } from './cad-report.component';

describe('CadReportComponent', () => {
  let component: CadReportComponent;
  let fixture: ComponentFixture<CadReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CadReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CadReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
