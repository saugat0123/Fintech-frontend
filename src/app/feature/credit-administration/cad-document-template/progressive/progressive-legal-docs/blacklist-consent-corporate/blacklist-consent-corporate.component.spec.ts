import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlacklistConsentCorporateComponent } from './blacklist-consent-corporate.component';

describe('BlacklistConsentCorporateComponent', () => {
  let component: BlacklistConsentCorporateComponent;
  let fixture: ComponentFixture<BlacklistConsentCorporateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlacklistConsentCorporateComponent ]
    })
        .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlacklistConsentCorporateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
