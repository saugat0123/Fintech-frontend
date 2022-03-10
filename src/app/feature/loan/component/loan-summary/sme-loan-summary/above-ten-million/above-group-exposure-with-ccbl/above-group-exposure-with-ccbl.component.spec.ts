import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboveGroupExposureWithCcblComponent } from './above-group-exposure-with-ccbl.component';

describe('AboveGroupExposureWithCcblComponent', () => {
  let component: AboveGroupExposureWithCcblComponent;
  let fixture: ComponentFixture<AboveGroupExposureWithCcblComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboveGroupExposureWithCcblComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboveGroupExposureWithCcblComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
