import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutiveRecommendationApprovalComponent } from './executive-recommendation-approval.component';

describe('ExecutiveRecommendationApprovalComponent', () => {
  let component: ExecutiveRecommendationApprovalComponent;
  let fixture: ComponentFixture<ExecutiveRecommendationApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExecutiveRecommendationApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExecutiveRecommendationApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
