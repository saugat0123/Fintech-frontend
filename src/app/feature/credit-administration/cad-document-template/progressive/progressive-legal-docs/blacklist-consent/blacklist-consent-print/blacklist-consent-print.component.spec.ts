import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlacklistConsentPrintComponent } from './blacklist-consent-print.component';

describe('BlacklistConsentPrintComponent', () => {
  let component: BlacklistConsentPrintComponent;
  let fixture: ComponentFixture<BlacklistConsentPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlacklistConsentPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlacklistConsentPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
