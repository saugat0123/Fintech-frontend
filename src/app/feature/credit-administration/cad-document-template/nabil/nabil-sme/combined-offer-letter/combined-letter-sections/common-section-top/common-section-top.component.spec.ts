import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonSectionTopComponent } from './common-section-top.component';

describe('CommonSectionTopComponent', () => {
  let component: CommonSectionTopComponent;
  let fixture: ComponentFixture<CommonSectionTopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonSectionTopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonSectionTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
