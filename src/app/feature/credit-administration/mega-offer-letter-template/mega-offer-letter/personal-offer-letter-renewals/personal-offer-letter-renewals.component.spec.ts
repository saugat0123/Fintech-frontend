import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalOfferLetterRenewalsComponent } from './personal-offer-letter-renewals.component';

describe('PersonalOfferLetterRenewalsComponent', () => {
  let component: PersonalOfferLetterRenewalsComponent;
  let fixture: ComponentFixture<PersonalOfferLetterRenewalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonalOfferLetterRenewalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalOfferLetterRenewalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
