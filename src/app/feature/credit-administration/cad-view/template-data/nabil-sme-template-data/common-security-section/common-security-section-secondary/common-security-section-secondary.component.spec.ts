import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonSecuritySectionSecondaryComponent } from './common-security-section-secondary.component';

describe('CommonSecuritySectionSecondaryComponent', () => {
  let component: CommonSecuritySectionSecondaryComponent;
  let fixture: ComponentFixture<CommonSecuritySectionSecondaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonSecuritySectionSecondaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonSecuritySectionSecondaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
