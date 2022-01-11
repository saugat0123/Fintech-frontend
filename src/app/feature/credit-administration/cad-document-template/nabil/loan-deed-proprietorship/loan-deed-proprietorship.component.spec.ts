import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanDeedProprietorshipComponent } from './loan-deed-proprietorship.component';

describe('LoanDeedProprietorshipComponent', () => {
  let component: LoanDeedProprietorshipComponent;
  let fixture: ComponentFixture<LoanDeedProprietorshipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanDeedProprietorshipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanDeedProprietorshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
