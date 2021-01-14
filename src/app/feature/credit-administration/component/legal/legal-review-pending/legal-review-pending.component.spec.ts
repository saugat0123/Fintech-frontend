import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalReviewPendingComponent } from './legal-review-pending.component';

describe('LegalReviewPendingComponent', () => {
  let component: LegalReviewPendingComponent;
  let fixture: ComponentFixture<LegalReviewPendingComponent>;

  beforeEach(async(() => {
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
