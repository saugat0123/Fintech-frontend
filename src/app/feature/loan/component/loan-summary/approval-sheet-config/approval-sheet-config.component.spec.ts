import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ApprovalSheetConfigComponent } from './approval-sheet-config.component';

describe('ApprovalSheetConfigComponent', () => {
  let component: ApprovalSheetConfigComponent;
  let fixture: ComponentFixture<ApprovalSheetConfigComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovalSheetConfigComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalSheetConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
