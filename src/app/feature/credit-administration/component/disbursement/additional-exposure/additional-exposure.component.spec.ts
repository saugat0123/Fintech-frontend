import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AdditionalExposureComponent } from './additional-exposure.component';

describe('AdditionalExposureComponent', () => {
  let component: AdditionalExposureComponent;
  let fixture: ComponentFixture<AdditionalExposureComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdditionalExposureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalExposureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
