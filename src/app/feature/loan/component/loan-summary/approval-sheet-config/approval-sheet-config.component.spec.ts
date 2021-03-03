import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovalSheetConfigComponent } from './approval-sheet-config.component';

describe('ApprovalSheetConfigComponent', () => {
  let component: ApprovalSheetConfigComponent;
  let fixture: ComponentFixture<ApprovalSheetConfigComponent>;

  beforeEach(async(() => {
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
