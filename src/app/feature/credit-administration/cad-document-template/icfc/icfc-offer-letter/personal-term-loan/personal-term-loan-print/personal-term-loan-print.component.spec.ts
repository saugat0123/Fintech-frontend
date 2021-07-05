import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalTermLoanPrintComponent } from './personal-term-loan-print.component';

describe('PersonalTermLoanPrintComponent', () => {
  let component: PersonalTermLoanPrintComponent;
  let fixture: ComponentFixture<PersonalTermLoanPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalTermLoanPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalTermLoanPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
