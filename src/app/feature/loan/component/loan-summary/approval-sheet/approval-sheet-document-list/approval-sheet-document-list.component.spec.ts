import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ApprovalSheetDocumentListComponent } from './approval-sheet-document-list.component';

describe('ApprovalSheetDocumentListComponent', () => {
  let component: ApprovalSheetDocumentListComponent;
  let fixture: ComponentFixture<ApprovalSheetDocumentListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovalSheetDocumentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovalSheetDocumentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
