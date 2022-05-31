import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonSectionTopPrintComponent } from './common-section-top-print.component';

describe('CommonSectionTopPrintComponent', () => {
  let component: CommonSectionTopPrintComponent;
  let fixture: ComponentFixture<CommonSectionTopPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonSectionTopPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonSectionTopPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
