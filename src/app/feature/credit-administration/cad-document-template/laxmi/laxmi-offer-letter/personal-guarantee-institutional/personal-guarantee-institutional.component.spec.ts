import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonamGuaranteeInstitutionalComponent } from './personal-guarantee-institutional.component';

describe('PersonamGuaranteeInstitutionalComponent', () => {
  let component: PersonamGuaranteeInstitutionalComponent;
  let fixture: ComponentFixture<PersonamGuaranteeInstitutionalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonamGuaranteeInstitutionalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonamGuaranteeInstitutionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
