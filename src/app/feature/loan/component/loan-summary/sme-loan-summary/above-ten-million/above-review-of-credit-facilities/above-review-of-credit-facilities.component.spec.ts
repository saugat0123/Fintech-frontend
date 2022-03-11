import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboveReviewOfCreditFacilitiesComponent } from './above-review-of-credit-facilities.component';

describe('AboveReviewOfCreditFacilitiesComponent', () => {
  let component: AboveReviewOfCreditFacilitiesComponent;
  let fixture: ComponentFixture<AboveReviewOfCreditFacilitiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboveReviewOfCreditFacilitiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboveReviewOfCreditFacilitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
