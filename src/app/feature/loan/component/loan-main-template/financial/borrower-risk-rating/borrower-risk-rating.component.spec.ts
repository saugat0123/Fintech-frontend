import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BorrowerRiskRatingComponent } from './borrower-risk-rating.component';

describe('BorrowerRiskRatingComponent', () => {
  let component: BorrowerRiskRatingComponent;
  let fixture: ComponentFixture<BorrowerRiskRatingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BorrowerRiskRatingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BorrowerRiskRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
