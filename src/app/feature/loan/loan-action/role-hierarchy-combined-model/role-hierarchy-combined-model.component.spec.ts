import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleHierarchyCombinedModelComponent } from './role-hierarchy-combined-model.component';

describe('RoleHierarchyCombinedModelComponent', () => {
  let component: RoleHierarchyCombinedModelComponent;
  let fixture: ComponentFixture<RoleHierarchyCombinedModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleHierarchyCombinedModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleHierarchyCombinedModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
