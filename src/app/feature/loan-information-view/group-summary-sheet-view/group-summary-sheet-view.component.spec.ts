import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupSummarySheetViewComponent } from './group-summary-sheet-view.component';

describe('GroupSummarySheetViewComponent', () => {
  let component: GroupSummarySheetViewComponent;
  let fixture: ComponentFixture<GroupSummarySheetViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupSummarySheetViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupSummarySheetViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
