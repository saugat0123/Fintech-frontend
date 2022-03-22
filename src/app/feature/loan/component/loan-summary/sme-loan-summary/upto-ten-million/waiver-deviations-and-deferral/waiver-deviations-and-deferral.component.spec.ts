import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaiverDeviationsAndDeferralComponent } from './waiver-deviations-and-deferral.component';

describe('WaiverDeviationsAndDeferralComponent', () => {
  let component: WaiverDeviationsAndDeferralComponent;
  let fixture: ComponentFixture<WaiverDeviationsAndDeferralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaiverDeviationsAndDeferralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaiverDeviationsAndDeferralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
