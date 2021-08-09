import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlacklistConsentInstitutionalComponent } from './blacklist-consent-institutional.component';

describe('BlacklistConsentInstitutionalComponent', () => {
  let component: BlacklistConsentInstitutionalComponent;
  let fixture: ComponentFixture<BlacklistConsentInstitutionalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlacklistConsentInstitutionalComponent ]
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlacklistConsentInstitutionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
