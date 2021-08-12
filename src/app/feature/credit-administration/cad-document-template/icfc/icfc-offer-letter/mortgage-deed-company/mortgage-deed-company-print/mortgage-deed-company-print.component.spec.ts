import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MortgageDeedCompanyPrintComponent } from './mortgage-deed-company-print.component';

describe('MortgageDeedCompanyPrintComponent', () => {
  let component: MortgageDeedCompanyPrintComponent;
  let fixture: ComponentFixture<MortgageDeedCompanyPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MortgageDeedCompanyPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MortgageDeedCompanyPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
