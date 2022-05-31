import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonSectionTopRetailComponent } from './common-section-top-retail.component';

describe('CommonSectionTopRetailComponent', () => {
  let component: CommonSectionTopRetailComponent;
  let fixture: ComponentFixture<CommonSectionTopRetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonSectionTopRetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonSectionTopRetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
