import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ApprovalSheetInfoComponent } from './approval-sheet-info.component';

describe('ApprovalSheetInfoComponent', () => {
  let component: ApprovalSheetInfoComponent;
  let fixture: ComponentFixture<ApprovalSheetInfoComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovalSheetInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalSheetInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
