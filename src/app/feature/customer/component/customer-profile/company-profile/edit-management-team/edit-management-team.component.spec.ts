import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EditManagementTeamComponent } from './edit-management-team.component';

describe('EditManagementTeamComponent', () => {
  let component: EditManagementTeamComponent;
  let fixture: ComponentFixture<EditManagementTeamComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EditManagementTeamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditManagementTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
