import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecurityApprovedSummaryComponent } from './security-approved-summary.component';

describe('SecurityApprovedSummaryComponent', () => {
  let component: SecurityApprovedSummaryComponent;
  let fixture: ComponentFixture<SecurityApprovedSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecurityApprovedSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityApprovedSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
