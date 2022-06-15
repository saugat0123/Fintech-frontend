import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeLoanComplianceStatusComponent } from './home-loan-compliance-status.component';

describe('HomeLoanComplianceStatusComponent', () => {
  let component: HomeLoanComplianceStatusComponent;
  let fixture: ComponentFixture<HomeLoanComplianceStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeLoanComplianceStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeLoanComplianceStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
