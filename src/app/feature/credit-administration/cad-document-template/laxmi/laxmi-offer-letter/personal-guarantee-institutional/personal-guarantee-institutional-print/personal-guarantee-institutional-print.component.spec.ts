import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalGuaranteeInstitutionalPrintComponent } from './personal-guarantee-institutional-print.component';

describe('PersonalGuaranteeInstitutionalPrintComponent', () => {
  let component: PersonalGuaranteeInstitutionalPrintComponent;
  let fixture: ComponentFixture<PersonalGuaranteeInstitutionalPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalGuaranteeInstitutionalPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalGuaranteeInstitutionalPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
