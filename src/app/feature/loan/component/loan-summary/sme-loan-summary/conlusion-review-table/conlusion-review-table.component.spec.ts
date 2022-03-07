import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConlusionReviewTableComponent } from './conlusion-review-table.component';

describe('ConlusionReviewTableComponent', () => {
  let component: ConlusionReviewTableComponent;
  let fixture: ComponentFixture<ConlusionReviewTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConlusionReviewTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConlusionReviewTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
