import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RoleAddComponent } from './role-add.component';

describe('RoleAddComponent', () => {
  let component: RoleAddComponent;
  let fixture: ComponentFixture<RoleAddComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
