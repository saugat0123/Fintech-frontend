import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoKycInformationComponent } from './video-kyc-information.component';

describe('VideoKycInformationComponent', () => {
  let component: VideoKycInformationComponent;
  let fixture: ComponentFixture<VideoKycInformationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoKycInformationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoKycInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
