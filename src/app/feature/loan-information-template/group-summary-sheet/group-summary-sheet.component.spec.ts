import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupSummarySheetComponent } from './group-summary-sheet.component';

describe('GroupSummarySheetComponent', () => {
  let component: GroupSummarySheetComponent;
  let fixture: ComponentFixture<GroupSummarySheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupSummarySheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupSummarySheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
