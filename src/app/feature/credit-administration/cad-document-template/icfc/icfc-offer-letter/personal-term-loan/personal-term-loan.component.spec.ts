import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalTermLoanComponent } from './personal-term-loan.component';

describe('PersonalTermLoanComponent', () => {
  let component: PersonalTermLoanComponent;
  let fixture: ComponentFixture<PersonalTermLoanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalTermLoanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalTermLoanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
