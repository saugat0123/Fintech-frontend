import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailRecommendationComponent } from './retail-recommendation.component';

describe('RetailRecommendationComponent', () => {
  let component: RetailRecommendationComponent;
  let fixture: ComponentFixture<RetailRecommendationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetailRecommendationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailRecommendationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
