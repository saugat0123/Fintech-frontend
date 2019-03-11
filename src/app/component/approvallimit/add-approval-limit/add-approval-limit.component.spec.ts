import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddApprovalLimitComponent } from './add-approval-limit.component';

describe('AddApprovalLimitComponent', () => {
  let component: AddApprovalLimitComponent;
  let fixture: ComponentFixture<AddApprovalLimitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddApprovalLimitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddApprovalLimitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
