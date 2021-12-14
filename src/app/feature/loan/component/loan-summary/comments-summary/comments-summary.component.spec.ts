import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CommentsSummaryComponent } from './comments-summary.component';

describe('CommentsSummaryComponent', () => {
  let component: CommentsSummaryComponent;
  let fixture: ComponentFixture<CommentsSummaryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentsSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
