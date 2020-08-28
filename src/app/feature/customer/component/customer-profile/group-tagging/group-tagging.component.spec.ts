import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupTaggingComponent } from './group-tagging.component';

describe('GroupTaggingComponent', () => {
  let component: GroupTaggingComponent;
  let fixture: ComponentFixture<GroupTaggingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupTaggingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupTaggingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
