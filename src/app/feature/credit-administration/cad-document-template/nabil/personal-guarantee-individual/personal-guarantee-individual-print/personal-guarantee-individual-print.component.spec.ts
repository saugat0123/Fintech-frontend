import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalGuaranteeIndividualPrintComponent } from './personal-guarantee-individual-print.component';

describe('PersonalGuaranteeIndividualPrintComponent', () => {
  let component: PersonalGuaranteeIndividualPrintComponent;
  let fixture: ComponentFixture<PersonalGuaranteeIndividualPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalGuaranteeIndividualPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalGuaranteeIndividualPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
