import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditManagementTeamComponent } from './edit-management-team.component';

describe('EditManagementTeamComponent', () => {
  let component: EditManagementTeamComponent;
  let fixture: ComponentFixture<EditManagementTeamComponent>;

  beforeEach(async(() => {
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
