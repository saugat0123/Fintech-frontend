import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlacklistConsentInstitutionalPrintComponent } from './blacklist-consent-institutional-print.component';

describe('BlacklistConsentInstitutionalPrintComponent', () => {
  let component: BlacklistConsentInstitutionalPrintComponent;
  let fixture: ComponentFixture<BlacklistConsentInstitutionalPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlacklistConsentInstitutionalPrintComponent ]
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlacklistConsentInstitutionalPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
