import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalGuaranteeProprietorshipPrintComponent } from './personal-guarantee-proprietorship-print.component';

describe('PersonalGuaranteeProprietorshipPrintComponent', () => {
  let component: PersonalGuaranteeProprietorshipPrintComponent;
  let fixture: ComponentFixture<PersonalGuaranteeProprietorshipPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalGuaranteeProprietorshipPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalGuaranteeProprietorshipPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
