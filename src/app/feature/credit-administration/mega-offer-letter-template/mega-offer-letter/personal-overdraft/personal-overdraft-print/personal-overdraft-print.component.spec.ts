import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalOverdraftPrintComponent } from './personal-overdraft-print.component';

describe('PersonalOverdraftPrintComponent', () => {
  let component: PersonalOverdraftPrintComponent;
  let fixture: ComponentFixture<PersonalOverdraftPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalOverdraftPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalOverdraftPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
