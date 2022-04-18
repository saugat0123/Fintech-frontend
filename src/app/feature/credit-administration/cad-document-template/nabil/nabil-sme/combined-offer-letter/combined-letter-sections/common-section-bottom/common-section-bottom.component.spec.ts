import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonSectionBottomComponent } from './common-section-bottom.component';

describe('CommonSectionBottomComponent', () => {
  let component: CommonSectionBottomComponent;
  let fixture: ComponentFixture<CommonSectionBottomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonSectionBottomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonSectionBottomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
