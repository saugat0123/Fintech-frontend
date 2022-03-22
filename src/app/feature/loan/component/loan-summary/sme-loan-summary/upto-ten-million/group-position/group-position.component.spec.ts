import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupPositionComponent } from './group-position.component';

describe('GroupPositionComponent', () => {
  let component: GroupPositionComponent;
  let fixture: ComponentFixture<GroupPositionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupPositionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupPositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
