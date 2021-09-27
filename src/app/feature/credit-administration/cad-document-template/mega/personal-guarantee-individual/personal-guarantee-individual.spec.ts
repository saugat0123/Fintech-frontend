import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalGuaranteeIndividual } from './personal-guarantee-individual';

describe('GuarantorIndividualComponent', () => {
  let component: PersonalGuaranteeIndividual;
  let fixture: ComponentFixture<PersonalGuaranteeIndividual>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalGuaranteeIndividual ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalGuaranteeIndividual);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
