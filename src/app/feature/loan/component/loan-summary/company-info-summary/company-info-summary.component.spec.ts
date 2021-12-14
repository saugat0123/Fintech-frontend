import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CompanyInfoSummaryComponent } from './company-info-summary.component';

describe('CompanyInfoSummaryComponent', () => {
  let component: CompanyInfoSummaryComponent;
  let fixture: ComponentFixture<CompanyInfoSummaryComponent>;

  beforeEach(waitForAsync(() => {
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
