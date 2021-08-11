import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedLoanListComponent } from './approved-loan-list.component';

describe('ApprovedLoanListComponent', () => {
  let component: ApprovedLoanListComponent;
  let fixture: ComponentFixture<ApprovedLoanListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApprovedLoanListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApprovedLoanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
