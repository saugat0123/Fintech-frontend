import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PostApprovalDocApproveComponent } from './post-approval-doc-approve.component';

describe('PostApprovalDocApproveComponent', () => {
  let component: PostApprovalDocApproveComponent;
  let fixture: ComponentFixture<PostApprovalDocApproveComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PostApprovalDocApproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostApprovalDocApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
