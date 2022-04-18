import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonSectionBottomPrintComponent } from './common-section-bottom-print.component';

describe('CommonSectionBottomPrintComponent', () => {
  let component: CommonSectionBottomPrintComponent;
  let fixture: ComponentFixture<CommonSectionBottomPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonSectionBottomPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonSectionBottomPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
