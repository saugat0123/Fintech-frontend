import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetailEducationalLoanEnglishComponent } from './retail-educational-loan-english.component';

describe('RetailEducationalLoanEnglishComponent', () => {
  let component: RetailEducationalLoanEnglishComponent;
  let fixture: ComponentFixture<RetailEducationalLoanEnglishComponent>;

  beforeEach(async(() => {
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
