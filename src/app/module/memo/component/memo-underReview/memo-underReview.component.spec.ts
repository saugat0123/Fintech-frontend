import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemoUnderReviewComponent } from './memo-underReview.component';

describe('MemoUnderReviewComponent', () => {
  let component: MemoUnderReviewComponent;
  let fixture: ComponentFixture<MemoUnderReviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemoUnderReviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemoUnderReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
