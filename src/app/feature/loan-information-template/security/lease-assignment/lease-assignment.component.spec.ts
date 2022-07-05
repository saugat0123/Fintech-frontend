import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaseAssignmentComponent } from './lease-assignment.component';

describe('LeaseAssignmentComponent', () => {
  let component: LeaseAssignmentComponent;
  let fixture: ComponentFixture<LeaseAssignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaseAssignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaseAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
