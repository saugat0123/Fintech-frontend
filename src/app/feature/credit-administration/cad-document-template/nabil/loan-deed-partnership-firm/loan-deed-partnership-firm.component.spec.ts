import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanDeedPartnershipFirmComponent } from './loan-deed-partnership-firm.component';

describe('LoanDeedPartnershipFirmComponent', () => {
  let component: LoanDeedPartnershipFirmComponent;
  let fixture: ComponentFixture<LoanDeedPartnershipFirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanDeedPartnershipFirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanDeedPartnershipFirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
