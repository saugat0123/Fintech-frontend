import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RetailEducationalLoanEnglishComponent } from './retail-educational-loan-english.component';

describe('RetailEducationalLoanEnglishComponent', () => {
  let component: RetailEducationalLoanEnglishComponent;
  let fixture: ComponentFixture<RetailEducationalLoanEnglishComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ RetailEducationalLoanEnglishComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetailEducationalLoanEnglishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
