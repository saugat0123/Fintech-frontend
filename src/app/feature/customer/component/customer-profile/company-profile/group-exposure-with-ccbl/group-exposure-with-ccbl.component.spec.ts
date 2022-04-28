import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupExposureWithCcblComponent } from './group-exposure-with-ccbl.component';

describe('GroupExposureWithCcblComponent', () => {
  let component: GroupExposureWithCcblComponent;
  let fixture: ComponentFixture<GroupExposureWithCcblComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupExposureWithCcblComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupExposureWithCcblComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
