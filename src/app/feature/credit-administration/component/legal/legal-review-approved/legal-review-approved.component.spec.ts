import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalReviewApprovedComponent } from './legal-review-approved.component';

describe('LegalReviewApprovedComponent', () => {
  let component: LegalReviewApprovedComponent;
  let fixture: ComponentFixture<LegalReviewApprovedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LegalReviewApprovedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegalReviewApprovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
