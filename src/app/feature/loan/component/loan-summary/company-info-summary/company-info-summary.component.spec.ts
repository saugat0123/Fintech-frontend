import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyInfoSummaryComponent } from './company-info-summary.component';

describe('CompanyInfoSummaryComponent', () => {
  let component: CompanyInfoSummaryComponent;
  let fixture: ComponentFixture<CompanyInfoSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyInfoSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyInfoSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
