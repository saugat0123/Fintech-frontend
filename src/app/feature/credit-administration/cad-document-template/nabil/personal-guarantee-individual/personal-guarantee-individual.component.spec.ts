import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalGuaranteeIndividualComponent } from './personal-guarantee-individual.component';

describe('PersonalGuaranteeIndividualComponent', () => {
  let component: PersonalGuaranteeIndividualComponent;
  let fixture: ComponentFixture<PersonalGuaranteeIndividualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalGuaranteeIndividualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalGuaranteeIndividualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
