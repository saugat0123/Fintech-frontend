import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CommonDataViewComponent } from './common-data-view.component';

describe('CommonDataViewComponent', () => {
  let component: CommonDataViewComponent;
  let fixture: ComponentFixture<CommonDataViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CommonDataViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonDataViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
