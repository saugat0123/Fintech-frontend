import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalGuaranteeProprietorshipComponent } from './personal-guarantee-proprietorship.component';

describe('PersonalGuaranteeProprietorshipComponent', () => {
  let component: PersonalGuaranteeProprietorshipComponent;
  let fixture: ComponentFixture<PersonalGuaranteeProprietorshipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalGuaranteeProprietorshipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalGuaranteeProprietorshipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
