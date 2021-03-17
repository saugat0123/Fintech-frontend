import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleHierarchyChainComponent } from './role-hierarchy-chain.component';

describe('RoleHeirarchyChainComponent', () => {
  let component: RoleHierarchyChainComponent;
  let fixture: ComponentFixture<RoleHierarchyChainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleHierarchyChainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleHierarchyChainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
