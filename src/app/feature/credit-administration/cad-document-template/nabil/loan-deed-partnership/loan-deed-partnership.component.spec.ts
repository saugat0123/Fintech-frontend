import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanDeedPartnershipComponent } from './loan-deed-partnership.component';

describe('LoanDeedPartnershipComponent', () => {
  let component: LoanDeedPartnershipComponent;
  let fixture: ComponentFixture<LoanDeedPartnershipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanDeedPartnershipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanDeedPartnershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
