import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LegalReviewPendingComponent } from './legal-review-pending.component';

describe('LegalReviewPendingComponent', () => {
  let component: LegalReviewPendingComponent;
  let fixture: ComponentFixture<LegalReviewPendingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LegalReviewPendingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegalReviewPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
