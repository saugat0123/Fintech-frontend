import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalLoanPrintComponent } from './personal-loan-print.component';

describe('PersonalLoanPrintComponent', () => {
  let component: PersonalLoanPrintComponent;
  let fixture: ComponentFixture<PersonalLoanPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalLoanPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalLoanPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
