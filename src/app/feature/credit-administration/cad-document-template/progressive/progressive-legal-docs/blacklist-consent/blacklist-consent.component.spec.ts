import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BlacklistConsentComponent } from './blacklist-consent.component';

describe('BlacklistConsentComponent', () => {
  let component: BlacklistConsentComponent;
  let fixture: ComponentFixture<BlacklistConsentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BlacklistConsentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlacklistConsentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
