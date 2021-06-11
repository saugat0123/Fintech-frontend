import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaseAssignmentSecurityComponent } from './lease-assignment-security.component';

describe('LeaseAssignmentSecurityComponent', () => {
  let component: LeaseAssignmentSecurityComponent;
  let fixture: ComponentFixture<LeaseAssignmentSecurityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaseAssignmentSecurityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaseAssignmentSecurityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
