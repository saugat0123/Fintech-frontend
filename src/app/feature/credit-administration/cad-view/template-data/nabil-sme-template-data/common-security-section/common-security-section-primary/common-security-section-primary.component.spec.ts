import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonSecuritySectionPrimaryComponent } from './common-security-section-primary.component';

describe('CommonSecuritySectionPrimaryComponent', () => {
  let component: CommonSecuritySectionPrimaryComponent;
  let fixture: ComponentFixture<CommonSecuritySectionPrimaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonSecuritySectionPrimaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonSecuritySectionPrimaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
