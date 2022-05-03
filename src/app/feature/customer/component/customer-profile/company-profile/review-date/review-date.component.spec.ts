import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewDateComponent } from './review-date.component';

describe('ReviewDateComponent', () => {
  let component: ReviewDateComponent;
  let fixture: ComponentFixture<ReviewDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
