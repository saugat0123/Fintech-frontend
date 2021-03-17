import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleHierarchyModelComponent } from './role-hierarchy-model.component';

describe('RoleHierarchyModelComponent', () => {
  let component: RoleHierarchyModelComponent;
  let fixture: ComponentFixture<RoleHierarchyModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleHierarchyModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleHierarchyModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
