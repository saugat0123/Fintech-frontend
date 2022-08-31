import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalGuaranteePartnershipComponent } from './personal-guarantee-partnership.component';

describe('PersonalGuaranteePartnershipComponent', () => {
  let component: PersonalGuaranteePartnershipComponent;
  let fixture: ComponentFixture<PersonalGuaranteePartnershipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalGuaranteePartnershipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalGuaranteePartnershipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
