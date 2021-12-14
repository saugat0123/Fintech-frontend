import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BlacklistConsentCorporatePrintComponent } from './blacklist-consent-corporate-print.component';

describe('BlacklistConsentCorporatePrintComponent', () => {
  let component: BlacklistConsentCorporatePrintComponent;
  let fixture: ComponentFixture<BlacklistConsentCorporatePrintComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BlacklistConsentCorporatePrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlacklistConsentCorporatePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
