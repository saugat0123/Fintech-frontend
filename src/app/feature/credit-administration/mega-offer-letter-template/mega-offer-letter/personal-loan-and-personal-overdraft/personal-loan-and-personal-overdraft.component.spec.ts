import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalLoanAndPersonalOverdraftComponent } from './personal-loan-and-personal-overdraft.component';

describe('PersonalLoanAndPersonalOverdraftComponent', () => {
  let component: PersonalLoanAndPersonalOverdraftComponent;
  let fixture: ComponentFixture<PersonalLoanAndPersonalOverdraftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalLoanAndPersonalOverdraftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalLoanAndPersonalOverdraftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
